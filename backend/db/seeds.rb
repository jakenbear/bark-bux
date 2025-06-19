# db/seeds.rb
Redemption.delete_all
User.delete_all
Reward.delete_all

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
    name: "Amazon Gift Card",
    description: "$25 Amazon e-Gift Card",
    points: 250,
    stock: 20
  },
  {
    name: "Bluetooth Headphones",
    description: "Wireless over-ear headphones",
    points: 1200,
    stock: 5
  },
  {
    name: "Coffee Subscription",
    description: "3-month subscription to premium coffee",
    points: 750,
    stock: 10
  },
  {
    name: "Desk Plant",
    description: "Live plant for your workspace",
    points: 300,
    stock: 15
  },
  {
    name: "Branded Hoodie",
    description: "Bark-Bux logo hoodie (unisex)",
    points: 800,
    stock: 8
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