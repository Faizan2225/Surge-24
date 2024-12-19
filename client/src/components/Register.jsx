// src/pages/RegisterPage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../Store/authStore"; // Zustand store

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { registerUser, alert } = useAuthStore();
  const navigate = useNavigate();

  const handleRegister = async () => {
    await registerUser({ name, phone, email, password });
    if (alert?.type === "success") {
      navigate("/verify-email"); // Navigate to email verification after successful registration
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="card w-96 bg-white shadow-xl p-6">
        <h2 className="text-center text-2xl font-bold mb-4">Register</h2>
        <div className="mb-4">
          <label className="label">Name</label>
          <input
            type="text"
            className="input input-bordered w-full"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="label">Phone</label>
          <input
            type="text"
            className="input input-bordered w-full"
            placeholder="Enter your phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="label">Email</label>
          <input
            type="email"
            className="input input-bordered w-full"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="label">Password</label>
          <input
            type="password"
            className="input input-bordered w-full"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {alert && alert.type === "error" && (
          <p className="text-red-500 text-sm mb-4">{alert.message}</p>
        )}
        <div className="flex justify-between items-center mb-4">
          <button className="btn btn-primary w-full" onClick={handleRegister}>
            {alert?.type === "loading" ? "Registering..." : "Register"}
          </button>
        </div>
        <p className="text-center">
          Already have an account?{" "}
          <button className="text-blue-500" onClick={() => navigate("/login")}>
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
