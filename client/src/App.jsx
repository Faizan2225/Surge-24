import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./components/Login";
import RegisterPage from "./components/Register";
import VerifyEmailPage from "./pages/VerifyEmail";
// import DashboardPage from "./pages/DashboardPage"
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./Pages/Home";
import Navbar from "./components/Layout/Navbar";
import OrganizationRegistrationPage from "./Pages/organizationRegistration";
import ReportNeedPage from "./Pages/ReportNeed";
import { useAuthStore } from "./Store/authStore";

const App = () => {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    initializeAuth();
  }, []);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" exact element={<LoginPage />} />
        <Route path="/" exact element={<Home />} />
        <Route path="/register" exact element={<RegisterPage />} />
        <Route path="/verify-email" exact element={<VerifyEmailPage />} />
        <Route path="/report-need" exact element={<ReportNeedPage />} />
        <Route
          path="/register-organization"
          exact
          element={<OrganizationRegistrationPage />}
        />
        {/* <ProtectedRoute path="/dashboard" exact component={DashboardPage} /> */}
      </Routes>
    </>
  );
};

export default App;
