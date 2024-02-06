import React from 'react';
import { Button } from '@mui/material';

const DeclineButton = ({ onClick, label, className, type }) => {
  return (
    <Button variant='outlined' color="primary" onClick={onClick} className={`btn btn-outline-primary ${className}`} type={type}>
      {label}
    </Button>
  );
};

export default DeclineButton;