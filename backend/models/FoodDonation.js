const db = require("../config/db");


const FoodDonation = {


create: async(food)=>{


const query=`

INSERT INTO FoodDonations
(
user_id,
food_name,
category,
quantity,
food_type,
location,
description,
status
)

VALUES

(
@user_id,
@food_name,
@category,
@quantity,
@food_type,
@location,
@description,
'Available'
)

`;

return db.query(query,food);

},



getAll:async()=>{


const query=`

SELECT 
FoodDonations.*,
Users.name AS donor_name

FROM FoodDonations

JOIN Users

ON FoodDonations.user_id=Users.id

ORDER BY created_at DESC

`;

return db.query(query);


},



getByUser:async(user_id)=>{


const query=`

SELECT * FROM FoodDonations

WHERE user_id=@user_id

`;

return db.query(query,{
user_id
});


},



delete:async(id)=>{


const query=`

DELETE FROM FoodDonations
WHERE id=@id

`;

return db.query(query,{
id
});


}



};


module.exports=FoodDonation;