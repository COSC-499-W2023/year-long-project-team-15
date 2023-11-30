import React from 'react';

const Button = ({ onClick, label, className, type }) => {
  return (
    <button onClick={onClick} className={className} type={type}>
      {label}
    </button>
  );
};

export default Button;
