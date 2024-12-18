import React, { useState } from "react";

const Rating = ({ disabled }) => {
  return (
    <div className="rating rating-sm">
      <input
        type="radio"
        name="rating-2"
        className="mask mask-star-2 bg-orange-400"
        disabled={disabled}
      />
      <input
        type="radio"
        name="rating-2"
        className="mask mask-star-2 bg-orange-400"
        defaultChecked
        disabled={disabled}
      />
      <input
        type="radio"
        name="rating-2"
        className="mask mask-star-2 bg-orange-400"
        disabled={disabled}
      />
      <input
        type="radio"
        name="rating-2"
        className="mask mask-star-2 bg-orange-400"
        disabled={disabled}
      />
      <input
        type="radio"
        name="rating-2"
        className="mask mask-star-2 bg-orange-400"
        disabled={disabled}
      />
    </div>
  );
};

export default Rating;
