# 🐾 Bark Bux Rewards Redemption App

## 📖 Overview

**Bark Bux** is a rewards redemption web app that lets users:

- View points balance  
- Browse rewards  
- Redeem rewards using points  
- View redemption history  

Built with Ruby on Rails backend (RESTful API) and React frontend styled with Tailwind CSS. Uses PostgreSQL in dev and production, deployed on Render.

Authentication with Devise + JWT protects backend API routes.

## ✨ Features

- Authenticated user routes with JWT + Devise  
- Points balance & reward browsing  
- Redeem rewards with validation  
- View redemption history  
- Responsive React UI with confetti & toast notifications  
- PostgreSQL with transactions and validations  

## 🛠️ Setup Instructions

### Prerequisites

- Ruby 3.4.3  
- Rails 8.0.2  
- Node.js 16+  
- Yarn  
- PostgreSQL 12+  
- Redis  
- Git  

### Clone Repo

git clone <repository-url>
cd bark-bux

### Backend Setup

cd backend
bundle install

createdb bark_bux_development
createdb bark_bux_test

Create `.env` file in backend with these contents:
DB_USERNAME=postgres
DB_PASSWORD=
REDIS_URL=redis://localhost:6379/1
SECRET_KEY_BASE=your_generated_secret_key_here

Run migrations:
rails db:migrate

Seed database:
rails db:seed

Start Redis:
redis-server

Start Rails server:
rails server -p 3001

### Frontend Setup

cd frontend
yarn install

Create frontend .env:
echo "REACT_APP_BACKEND_URL=http://localhost:3001" > .env

Start frontend:
yarn start

Access at: http://localhost:3000

## Authentication

- JWT token returned on login  
- All API routes protected  
- Auth state managed via React context  

## Deployment Notes

For Render deployment:
rails db:migrate
rails db:seed

## Project Structure

### Backend
- Models: User, Reward, Redemption  
- API endpoints: /api/v1/rewards, /redemptions  

### Frontend
- Pages: Home, Profile  
- Components: RewardCard, Navbar  

## Quick Start

1. Start PostgreSQL
2. Create databases:
   createdb bark_bux_development
   createdb bark_bux_test
3. Backend:
   bundle install
   rails db:migrate
   rails db:seed
   rails s -p 3001
4. Frontend:
   yarn install
   yarn start