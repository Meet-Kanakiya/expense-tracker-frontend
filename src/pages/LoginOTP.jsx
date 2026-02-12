import { useState } from "react";
import axios from "axios";
import "../css/LoginOTP.css";

const API = process.env.REACT_APP_API_URL;

function LoginOTP({ setToken, setPage }) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post(`${API}/api/login`, { email, password });
      setMessage(res.data.message || "OTP sent");
      setStep(2);
    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post(`${API}/api/verify-otp`, { email, otp });
      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
    } catch (err) {
      setMessage(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={step === 1 ? handleLogin : handleVerifyOTP}>
        <h1>{step === 1 ? "Login" : "Verify OTP"}</h1>

        {message && <p className="msg">{message}</p>}

        {step === 1 && (
          <>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
          </>
        )}

        {step === 2 && (
          <input value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter OTP" required />
        )}

        <button disabled={loading}>
          {loading ? "Please wait..." : step === 1 ? "Login" : "Verify OTP"}
        </button>
      </form>
    </div>
  );
}

export default LoginOTP;
