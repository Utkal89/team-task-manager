import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../context/authStore';
import '../styles/auth.css';
console.log("Signup component loaded");
export default function Signup() {
  const navigate = useNavigate();
  import { authService } from "../services/api";
<h1>🚀 TEST DEPLOY</h1>
const { signup } = authService;
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  console.log("Submitting form:", formData); // DEBUG

  try {
    const response = await signup(formData);

    console.log("Signup Success:", response.data); // DEBUG

    alert("Signup successful ✅");

    // optional redirect
    // navigate('/login');

  } catch (error) {
    console.error("Signup Error:", error); // DEBUG

    alert("Signup failed ❌");
  }
};

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>🚀 Team Task Manager</h1>
        <h2>Sign Up</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password (min 6 chars)"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button
  type="button"
  onClick={() => {
    console.log("BUTTON CLICKED");
  }}
>
  Sign Up
</button>
        </form>
        <p>
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
}
