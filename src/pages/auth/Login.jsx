import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        "https://musify-backend-67qs.onrender.com/api/token/",
        {
          username,
          password,
        }
      );

      console.log("LOGIN RESPONSE:", res.data);

      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("username", res.data.username);
      localStorage.setItem("role", res.data.role || "user");

      // ROLE REDIRECT (fixed artist typo)
      if (res.data.role === "user" || res.data.role === "listener") {
        navigate("/user");
      }
      else if (res.data.role === "artist" || res.data.role === "artists") {
        navigate("/artist");
      }
      else if (res.data.role === "admin") {
        navigate("/admin");
      }

    } catch (error) {
      console.log(error);
      alert("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        <h1>🎵 Musify</h1>
        <p className="subtitle">Login to continue</p>

        <form onSubmit={handleLogin}>
          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="login-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="auth-links">
          <p>
            Forgot password? <a href="/forgot-password">Reset</a>
          </p>

          <p>
            No account?{" "}
            <a href="/register-user">User</a> |{" "}
            <a href="/register-artist">Artist</a>
          </p>
        </div>

      </div>
    </div>
  );
}

export default Login;
