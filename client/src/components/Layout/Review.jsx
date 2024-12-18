import React from "react";
import Rating from "./Rating";

const Review = ({ desc, rating, name }) => {
  return (
    <div className="bg-base-100 p-4 rounded-lg shadow-md">
      <div className="flex items-center gap-2 mb-2">
        <span className="font-semibold">{name}</span>
        <Rating disabled={true}></Rating>
      </div>
      <p>{desc}</p>
    </div>
  );
};

export default Review;
