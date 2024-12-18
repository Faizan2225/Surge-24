import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Navbar from "./components/Layout/Navbar";
import Footer from "./components/Layout/Footer";
import Login from "./components/Login";
import Register from "./components/Register";
import Product from "./Pages/Product";
import Dashboard from "./Pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} exact></Route>
        <Route path="/login" element={<Login />} exact></Route>
        <Route path="/register" element={<Register />} exact></Route>
        <Route path="/product" element={<Product />} exact></Route>

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
          exact
        ></Route>
      </Routes>
      <Footer />
    </>
  );
}

export default App;
