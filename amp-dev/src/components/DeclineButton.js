import React from 'react';

const DeclineButton = ({ onClick, label, className, type }) => {
  return (
    <button onClick={onClick} className={`btn btn-danger ${className}`} type={type}>
      {label}
    </button>
  );
};

export default DeclineButton;