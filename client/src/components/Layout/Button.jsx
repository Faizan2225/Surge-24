import React from "react";

const Button = ({ content }) => {
  return (
    <button class="inline-block cursor-pointer rounded-md bg-gray-800 px-4 py-2 text-center text-sm font-semibold uppercase text-white transition duration-200 ease-in-out hover:bg-gray-900">
      {content}
    </button>
  );
};

export default Button;
