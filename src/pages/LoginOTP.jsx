import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function LoginOTP({ setToken }) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  // STEP 1: Email + Password
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/login`,
        { email, password }
      );

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
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/verify-otp`,
        { email, otp }
      );

      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setMessage(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-indigo-100 via-white to-slate-100">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 sm:p-8">

        <h1 className="text-2xl sm:text-3xl font-semibold text-center text-slate-800 mb-6">
          {step === 1 ? "Login to your account" : "Verify OTP"}
        </h1>

        {message && (
          <p className="text-sm text-center mb-4 text-amber-600">
            {message}
          </p>
        )}

        <form
          onSubmit={step === 1 ? handleLogin : handleVerifyOTP}
          className="space-y-5"
        >
          {step === 1 && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </>
          )}

          {step === 2 && (
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                Enter OTP
              </label>
              <input
                type="text"
                maxLength="6"
                className="w-full px-4 py-2 border rounded-lg text-center tracking-widest text-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                placeholder="------"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading && (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
            )}

            {loading
              ? step === 1
                ? "Sending OTP..."
                : "Verifying..."
              : step === 1
                ? "Login"
                : "Verify OTP"}
          </button>
        </form>

        {step === 1 && (
          <div className="flex justify-between mt-5 text-sm">
            <button
              onClick={() => navigate("/forgot")}
              className="text-indigo-600 hover:underline"
            >
              Forgot password?
            </button>

            <button
              onClick={() => navigate("/register")}
              className="text-indigo-600 hover:underline"
            >
              Register
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default LoginOTP;