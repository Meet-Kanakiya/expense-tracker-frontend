import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");

  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const checkPasswordStrength = (value) => {
    const strongRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

    if (strongRegex.test(value)) {
      setPasswordStrength("Strong");
    } else if (value.length >= 6) {
      setPasswordStrength("Medium");
    } else {
      setPasswordStrength("Weak");
    }
  };

  // STEP 1 – SEND OTP
  const sendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/forgot-password`,
        { email }
      );
      setMsg(res.data.message);
      setStep(2);
    } catch (err) {
      setMsg(err.response?.data?.message || "Something went wrong");
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
        `${process.env.REACT_APP_API_URL}/api/verify-forgot-otp`,
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

    // Validation Check
    if (passwordStrength !== "Strong") {
      setMsg("Please follow the password requirements.");
      return;
    }

    setLoading(true);

    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/reset-password`,
        { email, newPassword }
      );

      setMsg("Password reset successfully 🎉");

      setTimeout(() => {
        navigate("/login"); // ✅ Correct redirect
      }, 1500);
    } catch (err) {
      setMsg("Password reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-indigo-100 via-white to-slate-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 sm:p-8">

        <h2 className="text-2xl font-semibold text-center text-slate-800 mb-6">
          {step === 1 && "Forgot Password"}
          {step === 2 && "Verify OTP"}
          {step === 3 && "Create New Password"}
        </h2>

        {msg && (
          <p className="text-center text-sm mb-4 text-indigo-600">
            {msg}
          </p>
        )}

        <form
          onSubmit={
            step === 1
              ? sendOTP
              : step === 2
                ? verifyOTP
                : resetPassword
          }
          className="space-y-5"
        >

          {/* STEP 1 */}
          {step === 1 && (
            <input
              type="email"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <input
              type="text"
              maxLength={6}
              className="w-full px-4 py-2 text-center tracking-widest border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full px-4 py-2 pr-12 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  checkPasswordStrength(e.target.value);
                }}
                required
              />

              {/* Eye Icon */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-500 hover:text-indigo-600"
              >
                {showPassword ? "🙈" : "👁"}
              </button>
            </div>
          )}

          <button
            disabled={loading}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition duration-200 disabled:opacity-60"
          >
            {loading
              ? "Processing..."
              : step === 1
                ? "Send OTP"
                : step === 2
                  ? "Verify OTP"
                  : "Reset Password"}
          </button>

        </form>

        {step === 1 && (
          <p className="mt-4 text-center text-sm text-slate-600">
            Remember password?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-indigo-600 hover:underline cursor-pointer"
            >
              Login
            </span>
          </p>
        )}

      </div>
    </div>
  );
}

export default ForgotPassword;