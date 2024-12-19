import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../Store/authStore"; // Zustand store

const VerifyEmailPage = () => {
  const [otp, setOtp] = useState("");
  const { verifyEmail } = useAuthStore();
  const navigate = useNavigate();

  const handleVerify = async () => {
    await verifyEmail(otp);
    navigate("/dashboard");
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />
      <button onClick={handleVerify}>Verify Email</button>
    </div>
  );
};

export default VerifyEmailPage;
