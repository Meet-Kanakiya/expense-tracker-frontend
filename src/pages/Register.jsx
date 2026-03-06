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

  // 🔐 Password Validation States
  const [validations, setValidations] = useState({
    length: false,
    upper: false,
    lower: false,
    number: false,
    special: false,
  });

  const checkPasswordStrength = (value) => {
    const checks = {
      length: value.length >= 8,
      upper: /[A-Z]/.test(value),
      lower: /[a-z]/.test(value),
      number: /[0-9]/.test(value),
      special: /[^A-Za-z0-9]/.test(value),
    };
    setValidations(checks);

    const passedCount = Object.values(checks).filter(Boolean).length;

    if (passedCount === 5) {
      setPasswordStrength("Strong");
    } else if (passedCount >= 3) {
      setPasswordStrength("Medium");
    } else {
      setPasswordStrength("Weak");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (passwordStrength !== "Strong") {
      setError("Please meet all password requirements.");
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

  const isAllValid = Object.values(validations).every(Boolean);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-indigo-100 via-white to-slate-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-semibold text-center text-slate-800 mb-2">
          Create Account
        </h2>

        {/* Dynamic Requirements Text */}
        <p className={`text-[11px] text-center mb-6 px-4 transition-colors ${isAllValid ? "text-green-600" : "text-red-500"}`}>
          Password must be 8+ characters, include uppercase, lowercase, number and special character
        </p>

        {error && <p className="text-sm text-center mb-4 text-red-500">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Username</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              placeholder="xyz"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              placeholder="meet.sdb@uhbf.voihd"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Password</label>
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
                className="absolute right-0 top-0 h-11 w-12 flex items-center justify-center text-gray-500"
              >
                {showPassword ? "🙈" : "👁"}
              </button>
            </div>

            {password && (
              <div className="mt-2">
                <p className={`text-sm ${passwordStrength === "Strong" ? "text-green-600" : passwordStrength === "Medium" ? "text-yellow-500" : "text-red-500"}`}>
                  Password Strength: {passwordStrength}
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      passwordStrength === "Strong" ? "bg-green-500 w-full" : 
                      passwordStrength === "Medium" ? "bg-yellow-500 w-2/3" : "bg-red-500 w-1/3"
                    }`}
                  ></div>
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || (password.length > 0 && passwordStrength !== "Strong")}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        <div className="mt-5 text-center text-sm">
          <span className="text-slate-600">Already have an account?</span>{" "}
          <button onClick={() => navigate("/login")} className="text-indigo-600 hover:underline font-medium">Login</button>
        </div>
      </div>
    </div>
  );
}