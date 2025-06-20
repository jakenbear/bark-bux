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

- Ruby 3.4.3, Rails 8.0.2
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

Create .env in backend with:

DB_USERNAME=postgres
DB_PASSWORD=
REDIS_URL=redis://localhost:6379/1
SECRET_KEY_BASE=your_generated_secret_key_here

Run migrations & seed:

rails db:migrate
rails db:seed

Start Redis server locally:

redis-server

Start Rails backend:

rails server -p 3001

### Frontend Setup

cd frontend
yarn install
echo "REACT_APP_BACKEND_URL=http://localhost:3001" > .env
yarn start

Open http://localhost:3000.

## Authentication

- Devise + JWT protect API routes
- Login returns JWT token for requests
- Auth tokens handled in frontend AuthContext

## Deployment Notes

- Render auto-sets DATABASE_URL and REDIS_URL
- Run migrations & seeds on deploy:

rails db:migrate
rails db:seed

## Project Structure

### Backend (Rails)
- Models: User, Reward, Redemption
- Controllers: Api::V1::UsersController, RewardsController, RedemptionsController
- Devise + JWT authentication
- Redis + Sidekiq for jobs (optional)

### Frontend (React)
- Components: Login, Nav, RewardsList
- Pages: Home, Profile
- AuthContext manages auth state

## Technologies

**Backend:** Ruby 3.4.3, Rails 8.0.2, PostgreSQL, Redis, Devise, JWT  
**Frontend:** React 19.1, Tailwind CSS, Axios  
**Dev:** Node 16+, Yarn, Git  

## .env.example (backend)

DB_USERNAME=postgres
DB_PASSWORD=
REDIS_URL=redis://localhost:6379/1
SECRET_KEY_BASE=your_generated_secret_key_here

## Database Config Notes

- Uses config/database.yml with defaults for local dev
- Production uses DATABASE_URL env var
- No code changes needed between envs

## Quick Local Start Summary

1. Start PostgreSQL
2. Create dev/test DBs
3. Set .env with DB and Redis URLs
4. Run bundle install, rails db:migrate, rails db:seed
5. Start Redis server
6. Run backend: rails s -p 3001
7. Run frontend: yarn start