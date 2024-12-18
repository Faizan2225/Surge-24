import { useState } from "react";
import useUserStore from "../Store/userStore";
import { useAlert } from "react-alert";

const Register = () => {
  const { setUser } = useUserStore();
  const alert = useAlert();

  // State to handle form inputs and errors
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    password: "",
    confirmPassword: "",
    avatar: "",
  });
  const [errors, setErrors] = useState({});

  // Handle file input and other form changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "avatar") {
      const file = files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          setFormData((prev) => ({ ...prev, avatar: reader.result }));
        };
        reader.readAsDataURL(file);
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Validate form inputs
  const validateForm = () => {
    const newErrors = {};
    const { name, email, password, confirmPassword } = formData;

    if (!name) newErrors.name = "Full name is required.";
    if (!email) newErrors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(email))
      newErrors.email = "Invalid email format.";
    if (!password) newErrors.password = "Password is required.";
    else if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters long.";
    if (password !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      // Prepare user data for submission
      const userData = {
        name: formData.name,
        email: formData.email,
        bio: formData.bio,
        password: formData.password,
        avatar: formData.avatar,
      };

      setUser(userData);

      alert.success("Registration successful!");

      // Reset form after successful registration
      setFormData({
        name: "",
        email: "",
        bio: "",
        password: "",
        confirmPassword: "",
        avatar: "",
      });
      setErrors({});
    } catch (error) {
      alert.error(`Error: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-full max-w-sm shadow-2xl bg-base-100">
        <div className="card-body">
          <h2 className="text-2xl font-bold text-center">Register</h2>
          <form onSubmit={handleSubmit}>
            {/* Name Input */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>
              <input
                type="text"
                name="name"
                className="input input-bordered"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && (
                <span className="text-red-500 text-sm">{errors.name}</span>
              )}
            </div>
            {/* Email Input */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                name="email"
                className="input input-bordered"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && (
                <span className="text-red-500 text-sm">{errors.email}</span>
              )}
            </div>
            {/* Bio Input */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Bio</span>
              </label>
              <input
                type="text"
                name="bio"
                className="input input-bordered"
                placeholder="Enter your bio"
                value={formData.bio}
                onChange={handleChange}
              />
            </div>
            {/* Avatar Input */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Avatar</span>
              </label>
              <input
                type="file"
                name="avatar"
                className="file-input file-input-bordered"
                accept="image/*"
                onChange={handleChange}
              />
              {formData.avatar && (
                <img
                  src={formData.avatar}
                  alt="Avatar Preview"
                  className="mt-2 w-16 h-16 rounded-full"
                />
              )}
            </div>
            {/* Password Input */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                name="password"
                className="input input-bordered"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && (
                <span className="text-red-500 text-sm">{errors.password}</span>
              )}
            </div>
            {/* Confirm Password Input */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Confirm Password</span>
              </label>
              <input
                type="password"
                name="confirmPassword"
                className="input input-bordered"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              {errors.confirmPassword && (
                <span className="text-red-500 text-sm">
                  {errors.confirmPassword}
                </span>
              )}
            </div>
            {/* Submit Button */}
            <div className="form-control mt-4">
              <button className="btn btn-primary">Register</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
