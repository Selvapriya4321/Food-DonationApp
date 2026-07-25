import { Link } from "react-router-dom";
import "../styles/global.css";


function Navbar(){

return(

<nav className="navbar">

<h2 className="logo">
🍲 FoodShare
</h2>


<div className="nav-links">

<Link to="/">Home</Link>

<Link to="/food">
Food Available
</Link>

<Link to="/donate">
Donate
</Link>

<Link to="/about">
About
</Link>

<Link to="/contact">
Contact
</Link>

<Link className="login-btn" to="/login">
Login
</Link>


</div>


</nav>

)

}

export default Navbar;