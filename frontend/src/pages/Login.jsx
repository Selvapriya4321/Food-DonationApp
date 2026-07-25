import { Link } from "react-router-dom";
import "../styles/global.css";

function Login(){

return(

<div className="form-container">

<h1>Login</h1>

<form>

<input 
type="email"
placeholder="Email"
/>


<input
type="password"
placeholder="Password"
/>


<button>
Login
</button>


<p>
Don't have an account?
<Link to="/register">
 Register
</Link>
</p>


</form>


</div>

)

}

export default Login;