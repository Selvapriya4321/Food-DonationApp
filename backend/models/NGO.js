const db=require("../config/db");


const NGO={


create:async(ngo)=>{


const query=`

INSERT INTO NGOs

(
user_id,
ngo_name,
address,
certificate
)

VALUES

(
@user_id,
@ngo_name,
@address,
@certificate
)

`;


return db.query(query,ngo);


},



getAll:async()=>{


const query=`

SELECT * FROM NGOs

`;


return db.query(query);


},



findByUser:async(user_id)=>{


const query=`

SELECT * FROM NGOs

WHERE user_id=@user_id

`;

return db.query(query,{
user_id
});


}



};


module.exports=NGO;