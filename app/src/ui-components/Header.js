import * as React from "react"; 

// importing material UI components 
import AppBar from "@mui/material/AppBar"; 
import Box from "@mui/material/Box"; 
import Toolbar from "@mui/material/Toolbar"; 
import Typography from "@mui/material/Typography"; 
import Button from "@mui/material/Button"; 
import IconButton from "@mui/material/IconButton"; 
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export default function Header() { 
return ( 
	<AppBar position="static"> 
		<Toolbar> 
		{/*Inside the IconButton, we 
		can render various icons*/} 
		<IconButton 
			size="large"
			edge="start"
			color="inherit"
			aria-label="menu"
			sx={{ mr: 2 }} 
		> 
			{/*This is a simple Menu 
			Icon wrapped in Icon */} 
			<AccountCircleIcon /> 
		</IconButton> 
		{/* The Typography component applies 
		default font weights and sizes */} 

		<Typography variant="h6"
			component="div" sx={{ flexGrow: 1 }}> 
			Users Name 
		</Typography> 
        <Typography variant="h5" align="right" fontWeight="bold"
			component="div" sx={{ flexGrow: 1 }}> 
			BlurVid 
		</Typography>
		</Toolbar> 
	</AppBar> 
); 
}
