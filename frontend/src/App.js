import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Nav from "./components/Nav";
import Login from "./components/Login";
import RewardsList from "./components/RewardsList";
import Home from "./pages/Home";
import Profile from "./pages/Profile";

function ProtectedRoute({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <Router>
          <Nav />
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
        </Router>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
