import { useState } from "react";
import { useNeedStore } from "../Store/needStore";
import { reportNeed } from "../Services/needService";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import Swal from "sweetalert2";

const ReportNeedForm = ({ token }) => {
  const categories = useNeedStore((state) => state.categories);
  const urgencyLevels = useNeedStore((state) => state.urgencyLevels);

  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [urgency, setUrgency] = useState("");
  const [location, setLocation] = useState({ lat: 31.5497, lng: 74.3436 });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { category, description, urgency, location };

    try {
      await reportNeed(data, token);
      Swal.fire("Success!", "Your need has been reported!", "success");
    } catch (error) {
      Swal.fire("Error", error, "error");
    }
  };

  const handleMapClick = (e) => {
    setLocation({ lat: e.latLng.lat(), lng: e.latLng.lng() });
  };

  return (
    <form className="p-6 bg-base-200 rounded-lg" onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold mb-4">Report a Need</h2>

      <label className="block mb-2">Category</label>
      <select
        className="select select-bordered w-full mb-4"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        required
      >
        <option value="" disabled>
          Select a category
        </option>
        {categories.map((cat, index) => (
          <option key={index} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      <label className="block mb-2">Description</label>
      <textarea
        className="textarea textarea-bordered w-full mb-4"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows="4"
        required
      ></textarea>

      <label className="block mb-2">Urgency</label>
      <select
        className="select select-bordered w-full mb-4"
        value={urgency}
        onChange={(e) => setUrgency(e.target.value)}
        required
      >
        <option value="" disabled>
          Select urgency level
        </option>
        {urgencyLevels.map((level, index) => (
          <option key={index} value={level}>
            {level}
          </option>
        ))}
      </select>

      <label className="block mb-2">Pick a Location</label>
      <div className="w-full h-64 mb-4">
        <LoadScript googleMapsApiKey="AIzaSyAmiH8FUN0LjtcKr2ODYYKRmyNqqhzOBBU">
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "100%" }}
            center={location}
            zoom={12}
            onClick={handleMapClick}
          >
            <Marker position={location} />
          </GoogleMap>
        </LoadScript>
      </div>

      <button type="submit" className="btn btn-primary w-full">
        Submit Need
      </button>
    </form>
  );
};

export default ReportNeedForm;
