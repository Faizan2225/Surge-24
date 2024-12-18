import React from "react";

const Avatar = ({ src }) => {
  return (
    <div className="avatar">
      <div className="w-24 rounded">
        <img src={src} />
      </div>
    </div>
  );
};

export default Avatar;
