// import { useState } from "react";
// import axios from "axios";
// import "../css/Register.css";

// export default function Register({ setPage, setToken }) {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     try {
//       // 1️⃣ Register user
//       await axios.post("http://localhost:5000/register", {
//         name,
//         email,
//         password,
//       });

//       // 2️⃣ Auto login after register
//       const loginRes = await axios.post("http://localhost:5000/login", {
//         email,
//         password,
//       });

//       localStorage.setItem("token", loginRes.data.token);
//       setToken(loginRes.data.token);

//     } catch (err) {
//       setError(err.response?.data?.message || "Registration failed");
//       setName("");
//       setEmail("");
//       setPassword("");
//     }
//   };

//   return (
//     <div className="auth-container">
//       <div className="auth-box">
//         <h2>Create Account</h2>

//         {error && <p className="error-text">{error}</p>}

//         <form onSubmit={handleSubmit}>
//           <input
//             type="text"
//             placeholder="Username"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             required
//           />

//           <input
//             type="email"
//             placeholder="Email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />

//           <input
//             type="password"
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />

//           <button type="submit">Register</button>
//         </form>

//         <p className="switch-text">
//           Already have an account?
//           <span onClick={() => setPage("login")}> Login</span>
//         </p>
//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import axios from "axios";
import "../css/Register.css";

export default function Register({ setToken, setPage }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // await axios.post("http://localhost:5000/register", {
      //   name,
      //   email,
      //   password,
      // });

      const res = await axios.post(`${import.meta.env.VITE_API_URL}/register`, {
        name,
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      setToken(res.data.token); // ✅ THIS triggers dashboard

      // setPage("dashboard");

    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };


  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Create Account</h2>

        {error && <p className="error-text">{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

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

          <button type="submit">Register</button>
        </form>

        <p className="switch-text">
          Already have an account?
          <span onClick={() => setPage("login")}> Login</span>
        </p>
      </div>
    </div>
  );
}

