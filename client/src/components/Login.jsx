// src/pages/LoginPage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../Store/authStore"; // Zustand store

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loginUser, alert } = useAuthStore();
  const navigate = useNavigate();

  const handleLogin = async () => {
    await loginUser(email, password);
    if (alert?.type === "success") {
      navigate("/dashboard"); // Navigate to the dashboard on successful login
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="card w-96 bg-white shadow-xl p-6">
        <h2 className="text-center text-2xl font-bold mb-4">Login</h2>
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
          <button className="btn btn-primary w-full" onClick={handleLogin}>
            {alert?.type === "loading" ? "Logging in..." : "Login"}
          </button>
        </div>
        <p className="text-center">
          Don't have an account?{" "}
          <button
            className="text-blue-500"
            onClick={() => navigate("/register")}
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
