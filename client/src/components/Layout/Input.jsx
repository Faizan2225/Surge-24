import React from "react";

const Input = ({ placeholder }) => {
  return (
    <input
      type="text"
      placeholder="Type here"
      className="input input-bordered w-full max-w-xs"
    />
  );
};

export default Input;
