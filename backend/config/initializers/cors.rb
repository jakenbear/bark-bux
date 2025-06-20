# config/initializers/cors.rb

frontend_url = ENV.fetch("FRONTEND_URL", "http://localhost:3000")

Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins frontend_url

    resource "*",
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      expose: ["X-Debug-Cookie"],
      max_age: 7200
  end
end
