import React from "react";
import { Link } from "react-router-dom";

const Banner = () => {
  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <img
          src="https://dcassetcdn.com/design_img/2523470/636004/636004_13504460_2523470_61ac77a5_image.jpg"
          className="max-w-sm rounded-lg shadow-2xl"
        />
        <div>
          <h1 className="text-5xl font-bold">
            Disaster Relief Management System
          </h1>
          <p className="py-6">
            The Disaster Relief Management System (DRMS) is a centralized
            platform designed to streamline relief efforts during natural
            disasters like floods, hurricanes, and earthquakes
          </p>
          <Link to="/report-need">
            <button className="btn btn-primary">Report a need</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Banner;
