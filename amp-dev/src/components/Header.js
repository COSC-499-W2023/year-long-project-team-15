import React, { useState, useEffect } from "react";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Auth from '@aws-amplify/auth';

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

  return (
    <nav className="navbar navbar-expand-lg bg-dark">
      <div className="container-fluid">
        <div className="collapse navbar-collapse" id="navbarText" style={{ color: "white" }}>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <button type="button" className="btn">
                <AccountCircleIcon style={{ color: "white" }} />
              </button>
            </li>
            <li className="nav-item">
              <a className="nav-link" aria-disabled="true" style={{ color: "white" }}>{name}</a>
            </li>
          </ul>
          <h3 style={{ fontWeight: "bold" }}>
            <button type="button">BlurVid</button>
          </h3>
        </div>
      </div>
    </nav>
  );
}

export default Header;
