import React from 'react';
import { Dialog, DialogActions, DialogTitle } from '@mui/material';
import DeclineButton from './DeclineButton';
import AcceptButton from './AcceptButton';

const ConfirmationDialog = ({ open, onClose, onConfirm, message }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{message}</DialogTitle>
      <DialogActions>
        <DeclineButton onClick={onConfirm} label="Remove"/>
        <AcceptButton onClick={onClose} label="Cancel"/>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;