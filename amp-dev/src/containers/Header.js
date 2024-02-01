import React, { useState, useEffect } from "react";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Auth from '@aws-amplify/auth';
import { useNavigate } from 'react-router-dom';



const Header = () => {
  const [name, setName] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const authenticatedUser = await Auth.currentAuthenticatedUser();
        setName(authenticatedUser.attributes.name);
      } catch (error) {
        console.error('Error fetching authenticated user', error);
        // Handle error, e.g., set name to empty or a default value
      }
    };

    fetchUserData();
  }, []);

    const navigate = useNavigate();
    
    const handleAccountClick = () => {
      navigate('/accountpage'); // Navigate to the Account page
    };
  
    const handleMainClick = () => {
      navigate('/'); // Navigate to the new page
    };

  return (
<nav className="navbar navbar-expand-lg bg-dark">
    <div className="container-fluid">
        <button type="button" className="navbar-brand btn bg-dark" onClick={handleMainClick} style={{ color: "white" }}>
            <h2>BlurVid</h2>
        </button>
        <div className="collapse navbar-collapse" id="navbarText">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0 d-flex align-items-center">
                <li className="nav-item">
                <a className="nav-link disabled" href="#!" onClick={(e) => e.preventDefault()} style={{ color: "white" }}>{name}</a>                
                </li>
                <li className="nav-item">
                    <button id="account" type="button" className="btn" onClick={handleAccountClick}>
                        <AccountCircleIcon style={{ color: "white", fontSize: "40px" }} />
                    </button>
                </li>
            </ul>
        </div>
    </div>
</nav>

  );
}

export default Header;
