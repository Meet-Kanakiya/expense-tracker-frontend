import { useState } from "react";
import axios from "axios";
import "../css/LoginOTP.css";

function ForgotPassword({ setPage }) {

  const API = process.env.REACT_APP_API_URL;
  
  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);


  // STEP 1 – SEND OTP
  const sendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      const res = await axios.post(
        `${API}/api/forgot-password`,
        { email }
      );
      setMsg(res.data.message);
      setStep(2);
    } catch (err) {
      setMsg(err.response?.data?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  // STEP 2 – VERIFY OTP
  const verifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      await axios.post(
        `${API}/api/verify-forgot-otp`,
        { email, otp }
      );
      setStep(3);
    } catch (err) {
      setMsg("Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  // STEP 3 – RESET PASSWORD
  const resetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      await axios.post(
        `${API}/api/reset-password`,
        {
          email,
          newPassword,
        }
      );

      setMsg("Password reset successfully 🎉");
      setTimeout(() => setPage("login"), 1500);
    } catch (err) {
      setMsg("Password reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <form
        className="login-form"
        onSubmit={
          step === 1
            ? sendOTP
            : step === 2
            ? verifyOTP
            : resetPassword
        }
      >
        <h1>
          {step === 1 && "Forgot Password"}
          {step === 2 && "Verify OTP"}
          {step === 3 && "New Password"}
        </h1>

        {msg && <p className="msg">{msg}</p>}

        {step === 1 && (
          <input
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        )}

        {step === 2 && (
          <input
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
        )}

        {step === 3 && (
          <input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        )}

        <button disabled={loading}>
          {loading
            ? "Please wait..."
            : step === 1
            ? "Send OTP"
            : step === 2
            ? "Verify OTP"
            : "Reset Password"}
        </button>

        {step === 1 && (
          <p className="register-text">
            Remember password?{" "}
            <span onClick={() => setPage("login")}>Login</span>
          </p>
        )}
      </form>
    </div>
  );
}

export default ForgotPassword;
