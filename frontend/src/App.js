// src/App.js
import { lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { QueryProvider } from "./api/api";
import Nav from "./components/Nav";
import Login from "./components/Login";
import ErrorBoundary from "./components/ErrorBoundary";
const RewardsList = lazy(() => import("./components/RewardsList"));
const Home = lazy(() => import("./pages/Home"));
const Profile = lazy(() => import("./pages/Profile"));

function ProtectedRoute({ children }) {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <QueryProvider>
          <ErrorBoundary>
            <Router>
              <Nav />
              <Suspense fallback={<div className="p-4">Loading...</div>}>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route
                    path="/rewards"
                    element={
                      <ProtectedRoute>
                        <RewardsList />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/" element={<Home />} />
                </Routes>
              </Suspense>
            </Router>
          </ErrorBoundary>
        </QueryProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
