import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { useAuthStore } from "../Store/authStore";
import { registerOrganization } from "../services/organizationService";
import "daisyui/dist/full.css";
import Swal from "sweetalert2";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const OrganizationRegistrationPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [location, setLocation] = useState({ lat: 31.4511, lng: 74.2925 });
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const token = localStorage.getItem("token");

  console.log(token, "token");

  const handleLocationChange = (event) => {
    setLocation({
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const orgData = {
      name,
      email,
      contact,
      location,
      address,
    };

    try {
      setIsLoading(true);
      const response = await registerOrganization(orgData, token);
      Swal.fire(
        "Success!",
        "Your organization has been registered successfully!",
        "success"
      );
      navigate("/verify-email");
    } catch (error) {
      Swal.fire(
        "Error!",
        "Something went wrong. Please try again later.",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-base-200 min-h-screen">
      <h2 className="text-xl font-semibold text-center mb-6">
        Register Your Organization
      </h2>

      <form
        onSubmit={handleSubmit}
        className="max-w-xl mx-auto bg-white p-6 rounded-md shadow-md"
      >
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Organization Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="input input-bordered w-full mt-2"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input input-bordered w-full mt-2"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="contact"
            className="block text-sm font-medium text-gray-700"
          >
            Contact
          </label>
          <input
            type="text"
            id="contact"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            className="input input-bordered w-full mt-2"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="address"
            className="block text-sm font-medium text-gray-700"
          >
            Address
          </label>
          <input
            type="text"
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="input input-bordered w-full mt-2"
          />
        </div>

        <div className="mb-6">
          <LoadScript googleMapsApiKey="AIzaSyAmiH8FUN0LjtcKr2ODYYKRmyNqqhzOBBU">
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={location}
              zoom={13}
              onClick={handleLocationChange}
            >
              <Marker position={location} />
              <InfoWindow position={location}>
                <div>
                  <h3 className="font-semibold text-lg">Selected Location</h3>
                  <p>{address}</p>
                </div>
              </InfoWindow>
            </GoogleMap>
          </LoadScript>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={isLoading}
          >
            {isLoading ? "Registering..." : "Register Organization"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default OrganizationRegistrationPage;
