function FoodList(){

const foods=[

{
name:"Rice Packets",
location:"Chennai",
quantity:"50 Plates"
},

{
name:"Vegetable Meals",
location:"Madurai",
quantity:"30 Boxes"
},

{
name:"Bread",
location:"Coimbatore",
quantity:"100 Pieces"
}

];


return(

<div className="food-page">


<h1>
Available Food
</h1>


<div className="food-grid">


{
foods.map((food,index)=>(


<div className="food-card" key={index}>


<h2>
{food.name}
</h2>


<p>
Quantity: {food.quantity}
</p>


<p>
Location: {food.location}
</p>


<button>
Request Food
</button>


</div>


))
}


</div>


</div>


)


}


export default FoodList;