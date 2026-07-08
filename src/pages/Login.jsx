import { useState } from "react";
import axios from "axios";
import "../css/Login.css";

export default function Login({ setToken, setPage }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const loginUser = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);

      if (setToken) setToken(res.data.token);

      setMessage("Login successful ✅");
    } catch (err) {
      setMessage(
        err.response?.data?.message || "Invalid email or password ❌"
      );
      setEmail("");
      setPassword("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={loginUser}>
        <h1>Welcome Back</h1>

        {message && <p className="msg">{message}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <p className="register-text">
        Don’t have an account?{" "}
        <span onClick={() => setPage("register")} >
          Register
        </span>
      </p>
    </div>
  );
}
