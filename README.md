# 🐾 Bark Bux Rewards Redemption App

## 📖 Overview

**Bark Bux** is a rewards redemption web application that allows users to:

- View their points balance
- Browse available rewards
- Redeem rewards using points
- View their redemption history

This take-home assignment features a **Ruby on Rails** backend (RESTful API) and a **React** frontend, styled with **Tailwind CSS**. The app is deployed on **Render** and uses **PostgreSQL** for both development and production.

Designed with a fun, pet-themed interface, the app includes animations (like confetti on redemption) and toast notifications to enhance the user experience. Authentication is implemented with a mock token-based system, keeping the focus on core features like point management and reward redemption.

---

## ✨ Features

The Bark Bux app fulfills all core requirements of the take-home assignment:

- **View Points Balance**: Users can see their current points on the Profile and Rewards pages.
- **Browse Rewards**: The Rewards page lists all rewards with name, description, cost, and stock.
- **Redeem Rewards**: If eligible, users can redeem with UI feedback (confetti, toasts).
- **Redemption History**: View past redemptions with details and dates on the Profile page.
- **RESTful API**: Provides endpoints for users, rewards, redemptions.
- **Web Interface**: React frontend styled with Tailwind CSS, featuring Home, Login, Profile, Rewards.
- **Data Persistence**: PostgreSQL stores users, rewards, and redemptions.

---

## 🛠️ Setup Instructions

### ✅ Prerequisites

Ensure you have the following installed:

- Ruby: 3.4.3
- Rails: 8.0.2
- Node.js: v16+
- Yarn
- PostgreSQL: v12+
- Git

### 📦 Installation

#### Clone the Repository

```bash
git clone <repository-url>
cd bark-bux
```

### 🔧 Backend Setup

```bash
cd backend
bundle install
```

Start PostgreSQL, then:

```bash
psql -c "CREATE USER postgres WITH PASSWORD '';"  # Adjust if needed
createdb bark_bux_development
createdb bark_bux_test
rails db:migrate
rails db:seed
```

### 💻 Frontend Setup

```bash
cd frontend
yarn install
echo "REACT_APP_BACKEND_URL=http://localhost:3001" > .env
```

### 🚀 Running the Application

**Backend**:

```bash
cd backend
rails server -p 3001
```

**Frontend** (in a new terminal):

```bash
cd frontend
yarn start
```

Access the app at [http://localhost:3000](http://localhost:3000).

---

## 🔐 Accessing the App

Use any of these emails with any password (6+ characters):

- jakenbear@gmail.com
- mitch.marner@leafs.com
- morgan.patel@example.com

---

## 🌍 Deployment Notes

Deployed on Render with PostgreSQL. To deploy:

- Push code to GitHub
- Connect repository to Render

**Render Setup**:

- Backend: Ruby, command: `rails server -p 3001`
- Frontend: Node, build: `yarn build`, start: `yarn start`
- Set environment variables for DB credentials and `REACT_APP_BACKEND_URL`

Run:

```bash
rails db:migrate
rails db:seed
```

---

## 📁 Project Structure

### 🔙 Backend (Rails)

- **Models**
  - `user.rb`: Manages users
  - `reward.rb`: Manages rewards
  - `redemption.rb`: Links users and rewards, handles logic

- **Database**
  - `config/database.yml`
  - `db/schema.rb`
  - `db/seeds.rb`

- **API Endpoints**
  - `GET /api/v1/users`
  - `GET /api/v1/users/:id`
  - `GET /api/v1/rewards`
  - `POST /api/v1/redemptions`
  - `GET /api/v1/users/:id/redemptions`

### 🌐 Frontend (React)

- **Components**
  - `Login.js`, `Nav.js`, `Page.js`, `RewardsList.js`
- **Pages**
  - `Home.js`, `Profile.js`
- **Context**
  - `AuthContext.js`
- **App**
  - `App.js` (Routing + Auth)

---

## ✅ Meeting the Requirements

**Backend API**:

- `GET /api/v1/users/:id` → Points balance
- `GET /api/v1/rewards` → Reward list
- `POST /api/v1/redemptions` → Redeem (with validations)
- `GET /api/v1/users/:id/redemptions` → Redemption history

**Data Persistence**:

- PostgreSQL
- Validations and transactions for consistency

**Interface**:

- Fully responsive UI with Tailwind CSS
- Confetti and toasts for redemptions

---

## 🧠 Design Decisions

- **PostgreSQL**: Used instead of SQLite for better production compatibility.
- **Mock Auth**: Token-based, stored in localStorage.
- **Transaction Safety**: `with_lock` ensures atomic operations.
- **UI Feedback**: Confetti + Toasts for interaction delight.
- **State Management**: Centralized auth in `AuthContext`.
- **Error Handling**: Friendly messages on both frontend and backend.

---

## 🚧 Future Improvements

- Real authentication (e.g., JWT/devise)
- Pagination for redemptions
- Backend + frontend tests
- Reward images
- Notifications (email or in-app)
- Admin dashboard

---

## 🧰 Technology Stack

### Backend

- Ruby 3.4.3
- Rails 8.0.2
- PostgreSQL 12+

### Frontend

- React 19.1.0
- React Router 7.6.2
- Axios 1.9.0
- Tailwind CSS 3.4.17
- Canvas Confetti 1.9.3
- React Hot Toast 2.5.2
- React Helmet Async 2.0.5
- Date-fns 4.1.0

### Development

- Node.js 16+
- Yarn
- Git
- Render

---

Made with ❤️ and my brain.
