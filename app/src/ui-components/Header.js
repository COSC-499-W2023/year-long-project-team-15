import * as React from "react"; 
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { fontWeight } from "@mui/system";


export default function Header() { 
return ( 

<nav class="navbar navbar-expand-lg bg-dark" >
  <div class="container-fluid" >
    <div class="collapse navbar-collapse" id="navbarText" style={{color: "white"}}>
      <ul class="navbar-nav me-auto mb-2 mb-lg-0" >
        <li class="nav-item">
            <button type="button" class="btn">
                <AccountCircleIcon style={{color: "white"}}/> 
            </button>
        </li>
        <li class="nav-item">
        <a class="nav-link" aria-disabled="true" style={{color: "white"}}>Users Name</a>
        </li>
      </ul>
      <h3 style={{fontWeight:"bold"}}>
        BlurVid
      </h3>
    </div>
  </div>
</nav>
); 
}
