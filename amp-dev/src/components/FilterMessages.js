import React, { useMemo, useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, ListItemIcon, ListItemText, TextField, Button } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import MessageIcon from '@mui/icons-material/Message';

const FilterMessages = ({ selectedFriend, onFilterChange }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [dateFilter, setDateFilter] = useState('');

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDateFilterChange = (event) => {
    const selectedDate = event.target.value;
    setDateFilter(selectedDate);
    onFilterChange({ date: selectedDate });
  };

  const handleContentMessagesFilter = () => {
    // Trigger filter for content messages only
    onFilterChange({ includeContentMessagesOnly: true });
    setDateFilter('');
    handleClose();
  };
  const handleClearFilters = () => {
    onFilterChange({
      includeContentMessagesOnly: false, 
      date: null, 
    }); 
  };

  useMemo(() => {
    handleClearFilters();
  }, [selectedFriend])
  
  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {selectedFriend.name}
        </Typography>
        <IconButton
          aria-label="filter messages"
          aria-controls="filter-menu"
          aria-haspopup="true"
          onClick={handleClick}
          color="inherit"
        >
          <FilterListIcon />
        </IconButton>
        <Menu
          id="filter-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <Typography variant='h6' component="div" sx={{ marginLeft: '1em' }}>
            Filter Messages
          </Typography>
          <MenuItem onClick={handleContentMessagesFilter}>
            <ListItemIcon>
              <MessageIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Content Messages Only" />
          </MenuItem>
          <MenuItem>
            <ListItemIcon>
              <CalendarTodayIcon />
            </ListItemIcon>
            <TextField
            type="date"
            value={dateFilter}
            onChange={handleDateFilterChange}
            sx={{ marginRight: 2 }}
            />
          </MenuItem>
          <Button onClick={handleClearFilters} sx={{ marginLeft: '1em' }}>Clear Filters</Button> 
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default FilterMessages;

