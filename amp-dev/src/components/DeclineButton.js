import React from 'react';

const DeclineButton = ({ onClick, label, className, type }) => {
  return (
    <button onClick={onClick} className={`btn btn-outline-primary ${className}`} type={type}>
      {label}
    </button>
  );
};

export default DeclineButton;