# db/seeds.rb
# Use to reset DB, will also reset DB on Render per deploy
#Redemption.delete_all
#User.delete_all
#Reward.delete_all

puts "Seeding users..."

users = [
  { name: "Jake Reardon", email: "jakenbear@gmail.com", password: "password123" },
  { name: "Mitch Marner", email: "mitch.marner@leafs.com", password: "password123" },
  { name: "Morgan Patel", email: "morgan.patel@example.com", password: "password123" }
]

users.each do |attrs|
  User.find_or_create_by!(email: attrs[:email]) do |user|
    user.name = attrs[:name]
    user.points = 25_000
    user.password = attrs[:password]
    user.password_confirmation = attrs[:password]
  end
end

puts "Seeding rewards..."

rewards = [
  {
    name: "Chewy Gift Card",
    description: "$25 Chewy e-Gift Card",
    points: 250,
    stock: 20
  },
  {
    name: "Bark & Chill Hoodie",
    description: "Cozy hoodie with dog-lover design",
    points: 800,
    stock: 8
  },
  {
    name: "Pupflix Subscription",
    description: "3-month access to dog-themed content",
    points: 750,
    stock: 10
  },
  {
    name: "Pawsitive Vibes Mug",
    description: "Ceramic mug with dog quote",
    points: 300,
    stock: 15
  },
  {
    name: "Snooze Buddy Blanket",
    description: "Soft fleece blanket with paw prints",
    points: 600,
    stock: 12
  },
  {
    name: "Dog Park Adventure Kit",
    description: "Tote with ball, frisbee, and treats",
    points: 1200,
    stock: 5
  },
  {
    name: "Treat Yo’ Self Jar",
    description: "Glass treat jar with cute label",
    points: 450,
    stock: 10
  },
  {
    name: "Tail Wagger Cap",
    description: "Adjustable cap with embroidered dog",
    points: 350,
    stock: 14
  },
  {
    name: "Good Dog Candle",
    description: "Scented candle with calming aroma",
    points: 500,
    stock: 10
  }
]

rewards.each do |attrs|
  Reward.find_or_create_by!(name: attrs[:name]) do |reward|
    reward.description = attrs[:description]
    reward.points = attrs[:points]
    reward.stock = attrs[:stock]
  end
end

puts "Seeding complete!"
