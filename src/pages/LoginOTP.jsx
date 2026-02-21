import { useState } from "react";
import axios from "axios";
import "../css/LoginOTP.css";

function LoginOTP({ setToken, setPage }) {
  const [step, setStep] = useState(1); // 1 = login, 2 = otp
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // STEP 1: Email + Password
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/login`,{
        email,
        password,
      });

      setMessage(res.data.message || "OTP sent to your email");
      setStep(2);
    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };
  
  // STEP 2: Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/verify-otp`, {
        email,
        otp,
      });

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
      <form
        className="login-form"
        onSubmit={step === 1 ? handleLogin : handleVerifyOTP}
      >
        <h1>{step === 1 ? "Login" : "Verify OTP"}</h1>

        {message && <p className="msg">{message}</p>}

        {step === 1 && (
          <>
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
          </>
        )}

        {step === 2 && (
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
        )}

        <button disabled={loading}>
          {loading
            ? step === 1
              ? "Sending OTP..."
              : "Verifying..."
            : step === 1
              ? "Login"
              : "Verify OTP"}
        </button>

        {step === 1 && (

          <p className="register-text register-row">
            <span onClick={() => setPage("forgot")}>
              Forgot password?
            </span>

            <span onClick={() => setPage("register")}>
              Register
            </span>
          </p>

        )}
      </form>
    </div>
  );
}

export default LoginOTP;
