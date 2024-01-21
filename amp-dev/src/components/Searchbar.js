
import React from 'react';

const SearchBar = ({ searchTerm, onSearchChange }) => (
  <form className="d-flex" role="search" style={{ padding: "0.5em" }}>
    <input 
      className="form-control me-2" 
      type="search" 
      placeholder="Search Contacts" 
      aria-label="Search" 
      value={searchTerm} 
      onChange={onSearchChange} 
    />
  </form>
);

export default SearchBar;
