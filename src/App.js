import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import LoginOTP from "./pages/LoginOTP";
import ForgotPassword from "./pages/ForgotPassword";

function App() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-slate-100">
        <Routes>
          
          {/* Public Routes */}
          <Route
            path="/login"
            element={<LoginOTP setToken={setToken} />}
          />
          <Route
            path="/register"
            element={<Register setToken={setToken} />}
          />
          <Route
            path="/forgot"
            element={<ForgotPassword />}
          />

          {/* Protected Route */}
          <Route
            path="/dashboard"
            element={
              token ? <Dashboard /> : <Navigate to="/login" />
            }
          />

          {/* Default Redirect */}
          <Route
            path="*"
            element={<Navigate to={token ? "/dashboard" : "/login"} />}
          />

        </Routes>
      </div>
    </Router>
  );
}

export default App;