import React from 'react';

const AcceptButton = ({ onClick, label, className, type }) => {
  return (
    <button onClick={onClick} className={`btn btn-success ${className}`} type={type}>
      {label}
    </button>
  );
};

export default AcceptButton;