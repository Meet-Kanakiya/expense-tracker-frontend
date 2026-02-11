import { useState } from "react";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import LoginOTP from "./pages/LoginOTP";
import ForgotPassword from "./pages/ForgotPassword";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [page, setPage] = useState("login");

  if (!token) {
    if (page === "login") {
      return <LoginOTP setToken={setToken} setPage={setPage} />;
    }

    if (page === "register") {
      return <Register setToken={setToken} setPage={setPage} />;
    }

    if (page === "forgot") {
      return <ForgotPassword setPage={setPage} />;
    }
  }

  return <Dashboard />;
}

export default App;
