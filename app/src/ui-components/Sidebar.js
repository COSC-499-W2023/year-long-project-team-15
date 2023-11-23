import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemButton, ListItemText, TextField } from '@mui/material';


const Sidebar = ({ friends }) => {
  const [searchTerm, setSearchTerm] = useState('');

//need graphql query to query friends then map them to list element buttons to update main window 


//   const filteredFriends = friends.filter(friend =>
//     friend.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

  return (
    <div className="container-fluid ">
        <div className='row'>
           <div className="col-3  col-auto min-vh-100 bg-body-secondary">
                <form class="d-flex" role="search" style={{padding: "0.5em"}}>
                    <input class="form-control me-2" type="search" placeholder="Search Contacts" aria-label="Search"/>
                    <button class="btn btn-secondary" type="submit">Search</button>
                </form>


           </div>
        </div>
    </div>
  );
  }

export default Sidebar;
