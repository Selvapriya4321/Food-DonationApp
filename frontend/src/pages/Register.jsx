import { Link } from "react-router-dom";

function Register(){

return(

<div className="form-container">


<h1>Create Account</h1>


<form>


<input
placeholder="Full Name"
/>


<input
type="email"
placeholder="Email"
/>


<input
type="password"
placeholder="Password"
/>


<select>

<option>
Select Role
</option>

<option>
Donor
</option>

<option>
Receiver
</option>

</select>


<button>
Register
</button>


<p>
Already have account?
<Link to="/login">
 Login
</Link>
</p>


</form>


</div>

)

}


export default Register;