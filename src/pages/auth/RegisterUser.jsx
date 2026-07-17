import { useState } from "react";
import axios from "axios";

function RegisterUser() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    if (!form.username || !form.email || !form.password) {
      alert("All fields are required");
      return;
    }

    try {
      setLoading(true);

      await axios.post("http://localhost:8000/api/accounts/register/", {
        ...form,
        role: "user",
      });

      alert("User registered successfully");

      setForm({
        username: "",
        email: "",
        password: "",
      });

    } catch (err) {
  console.log("FULL ERROR:", err.response?.data);
  alert("Registration failed: " + JSON.stringify(err.response?.data));
}
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">

        <h2>🎵 User Register</h2>

        <form onSubmit={handleSubmit}>

          <input
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
          />

          <input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
          />

          <button disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>

        </form>

      </div>
    </div>
  );
}

export default RegisterUser;