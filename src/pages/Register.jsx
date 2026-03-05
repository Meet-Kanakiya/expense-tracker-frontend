import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register({ setToken }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  // 🔐 Password Strength Checker
  const checkPasswordStrength = (value) => {
    const strongRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_\-+=]).{8,}$/;

    if (strongRegex.test(value)) {
      setPasswordStrength("Strong");
    } else if (value.length >= 6) {
      setPasswordStrength("Medium");
    } else {
      setPasswordStrength("Weak");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // ❌ Stop if password not strong
    if (passwordStrength !== "Strong") {
      setError("Please enter a strong password.");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/register`,
        { name, email, password }
      );

      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-indigo-100 via-white to-slate-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 sm:p-8">

        <h2 className="text-2xl sm:text-3xl font-semibold text-center text-slate-800 mb-6">
          Create Account
        </h2>

        {error && (
          <p className="text-sm text-center mb-4 text-red-500">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">
              Username
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              placeholder="Enter your username"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Email */}
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

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full h-11 px-4 pr-12 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  checkPasswordStrength(e.target.value);
                }}
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 top-0 h-11 w-12 flex items-center justify-center text-gray-500 hover:text-indigo-600 transition"
              >
                {showPassword ? (
                  // Eye Off (Correct Full Icon)
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-7-9-7a18.45 18.45 0 014.22-5.94M9.88 9.88a3 3 0 104.24 4.24M6.1 6.1L3 3m0 0l18 18"
                    />
                  </svg>
                ) : (
                  // Eye (Already Correct)
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm7 0s-4-7-10-7S2 12 2 12s4 7 10 7 10-7 10-7z"
                    />
                  </svg>
                )}
              </button>
            </div>

            {/* Strength */}
            {password && (
              <>
                <p
                  className={`text-sm mt-2 ${passwordStrength === "Strong"
                    ? "text-green-600"
                    : passwordStrength === "Medium"
                      ? "text-yellow-500"
                      : "text-red-500"
                    }`}
                >
                  Password Strength: {passwordStrength}
                </p>

                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${passwordStrength === "Strong"
                      ? "bg-green-500 w-full"
                      : passwordStrength === "Medium"
                        ? "bg-yellow-500 w-2/3"
                        : "bg-red-500 w-1/3"
                      }`}
                  ></div>
                </div>
              </>
            )}
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Creating Account..." : "Register"}
          </button>

        </form>

        <div className="mt-5 text-center text-sm">
          <span className="text-slate-600">
            Already have an account?
          </span>{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-indigo-600 hover:underline font-medium"
          >
            Login
          </button>
        </div>

      </div>
    </div>
  );
}