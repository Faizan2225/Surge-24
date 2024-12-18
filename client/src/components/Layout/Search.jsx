import React, { useState } from "react";

const SearchComponent = ({ onSearch }) => {
  const [searchInput, setSearchInput] = useState("");

  const handleInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchInput.trim());
    }
  };

  return (
    <div className="form-control w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="input-group">
        <input
          type="text"
          placeholder="Search..."
          value={searchInput}
          onChange={handleInputChange}
          className="input input-bordered flex-grow"
          required
        />
        <button type="submit" className="btn btn-primary">
          Search
        </button>
      </form>
    </div>
  );
};

export default SearchComponent;
