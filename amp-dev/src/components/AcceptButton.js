import React from 'react';
import { Button } from '@mui/material';

const AcceptButton = ({ onClick, label, className, type }) => {
  return (
    <Button variant="contained"  color="primary" onClick={onClick} className={`btn btn-primary ${className}`} type={type}>
      {label}
    </Button>
  );
};

export default AcceptButton;