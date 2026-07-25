import { Link } from "react-router-dom";


function Home(){


return(

<div className="home">


<section className="hero">


<div>

<h1>
Share Food.
<br/>
Spread Happiness.
</h1>


<p>
Donate extra food and help reduce hunger
in your community.
</p>


<Link to="/donate">

<button>
Donate Food
</button>

</Link>


</div>


<img 
src="https://images.unsplash.com/photo-1593113646773-028c64a8f1b8"
alt="food"
/>


</section>



<section className="cards">


<div>
<h2>
🌱 Reduce Waste
</h2>
<p>
Save excess food from being wasted.
</p>
</div>


<div>
<h2>
❤️ Help People
</h2>
<p>
Connect food donors with receivers.
</p>
</div>


<div>
<h2>
🤝 Build Community
</h2>
<p>
Create a hunger-free society.
</p>
</div>


</section>


</div>

)

}


export default Home;