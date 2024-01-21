
import React from 'react';
import Button from './Button.js'; 

const LogoutButton = ({ onSignOut }) => (
  <div className="mt-auto p-2">
    <Button
      label="LogOut"
      onClick={onSignOut}
      className="btn btn-secondary"
    />
  </div>
);

export default LogoutButton;
