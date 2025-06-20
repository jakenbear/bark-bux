module Api
  module V1
    class RedemptionsController < V1Controller
      before_action :authenticate_user!
      
      def index
        redemptions = current_user.redemptions
                                 .includes(:reward)
                                 .order(created_at: :desc)
        
        render json: redemptions, each_serializer: RedemptionSerializer
      end

      def create
        idempotency_key = request.headers["Idempotency-Key"] || SecureRandom.uuid
        
        if Redemption.exists?(idempotency_key: idempotency_key)
          redemption = Redemption.find_by(idempotency_key: idempotency_key)
          return render json: { 
            status: "success",
            redemption: format_single_redemption(redemption)
          }, status: :ok
        end

        reward = Reward.find(params[:reward_id])

        unless current_user.points >= reward.points && reward.stock > 0
          return render json: { 
            status: "error",
            error: "Cannot redeem: insufficient points or out of stock" 
          }, status: :unprocessable_entity
        end

        begin
          success = RedemptionService.new(current_user, reward, idempotency_key).redeem

          if success
            redemption = Redemption.find_by(idempotency_key: idempotency_key)
            render json: {
              status: "success",
              redemption: format_single_redemption(redemption)
            }, status: :ok
          else
            render json: {
              status: "error",
              error: "Redemption failed"
            }, status: :unprocessable_entity
          end
        rescue => e
          render json: {
            status: "error",
            error: e.message
          }, status: :unprocessable_entity
        end
      rescue ActiveRecord::RecordNotFound
        render json: { 
          status: "error",
          error: "Reward not found" 
        }, status: :not_found
      end

      private

      def redemption_params
        params.require(:redemption).permit(:reward_id)
      end

      def format_redemptions(redemptions)
        redemptions.map { |r| format_single_redemption(r) }
      end

      def format_single_redemption(redemption)
        {
          id: redemption.id,
          redeemed_at: redemption.redeemed_at,
          created_at: redemption.created_at,
          reward: {
            id: redemption.reward.id,
            name: redemption.reward.name,
            description: redemption.reward.description,
            points: redemption.reward.points
          }
        }
      end
    end
  end
end
