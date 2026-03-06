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
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔐 Added Strength Logic
  const [passwordStrength, setPasswordStrength] = useState("");
  const [validations, setValidations] = useState({
    length: false, upper: false, lower: false, number: false, special: false,
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
    if (passedCount === 5) setPasswordStrength("Strong");
    else if (passedCount >= 3) setPasswordStrength("Medium");
    else setPasswordStrength("Weak");
  };

  const sendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/forgot-password`, { email });
      setMsg(res.data.message);
      setStep(2);
    } catch (err) {
      setMsg(err.response?.data?.message || "Something went wrong");
    } finally { setLoading(false); }
  };

  const verifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/verify-forgot-otp`, { email, otp });
      setStep(3);
    } catch (err) { setMsg("Invalid or expired OTP"); }
    finally { setLoading(false); }
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    if (passwordStrength !== "Strong") {
      setMsg("Password must be Strong.");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/reset-password`, { email, newPassword });
      setMsg("Password reset successfully 🎉");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) { setMsg("Password reset failed"); }
    finally { setLoading(false); }
  };

  const isAllValid = Object.values(validations).every(Boolean);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-indigo-100 via-white to-slate-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 sm:p-8">
        <h2 className="text-2xl font-semibold text-center text-slate-800 mb-2">
          {step === 1 && "Forgot Password"}
          {step === 2 && "Verify OTP"}
          {step === 3 && "Create New Password"}
        </h2>

        {step === 3 && (
            <p className={`text-[11px] text-center mb-4 transition-colors ${isAllValid ? "text-green-600" : "text-red-500"}`}>
                Password must be 8+ characters, include uppercase, lowercase, number and special character
            </p>
        )}

        {msg && <p className={`text-center text-sm mb-4 ${msg.includes("success") ? "text-green-600" : "text-indigo-600"}`}>{msg}</p>}

        <form onSubmit={step === 1 ? sendOTP : step === 2 ? verifyOTP : resetPassword} className="space-y-5">
          {step === 1 && (
            <input type="email" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          )}

          {step === 2 && (
            <input type="text" maxLength={6} className="w-full px-4 py-2 text-center tracking-widest border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400" placeholder="Enter 6-digit OTP" value={otp} onChange={(e) => setOtp(e.target.value)} required />
          )}

          {step === 3 && (
            <div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full px-4 py-2 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => { setNewPassword(e.target.value); checkPasswordStrength(e.target.value); }}
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5 text-gray-500">{showPassword ? "🙈" : "👁"}</button>
              </div>

              {newPassword && (
                <div className="mt-2">
                  <p className={`text-sm ${passwordStrength === "Strong" ? "text-green-600" : passwordStrength === "Medium" ? "text-yellow-500" : "text-red-500"}`}>Strength: {passwordStrength}</p>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                    <div className={`h-1.5 rounded-full transition-all duration-300 ${passwordStrength === "Strong" ? "bg-green-500 w-full" : passwordStrength === "Medium" ? "bg-yellow-500 w-2/3" : "bg-red-500 w-1/3"}`}></div>
                  </div>
                </div>
              )}
            </div>
          )}

          <button disabled={loading || (step === 3 && newPassword.length > 0 && passwordStrength !== "Strong")} className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition disabled:opacity-60">
            {loading ? "Processing..." : step === 1 ? "Send OTP" : step === 2 ? "Verify OTP" : "Reset Password"}
          </button>
        </form>

        {step === 1 && (
          <p className="mt-4 text-center text-sm text-slate-600">Remember password? <span onClick={() => navigate("/login")} className="text-indigo-600 hover:underline cursor-pointer">Login</span></p>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;  