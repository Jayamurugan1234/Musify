import { useState } from "react";
import axios from "axios";
import "./ForgotPassword.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = async () => {
    try {
      await axios.post(
        "https://musify-backend-67qs.onrender.com/api/accounts/forgot-password/",
        { email }
      );

      alert("Reset link sent to email");
    } catch (error) {
      console.log(error);
      alert("Failed to send reset link");
    }
  };

  return (
    <div className="forgot-container">
      <div className="forgot-card">
        <h2>Forgot Password</h2>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button onClick={handleSubmit}>
          Send Reset Link
        </button>
      </div>
    </div>
  );
}

export default ForgotPassword;
