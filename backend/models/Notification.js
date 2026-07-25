const db=require("../config/db");


const Notification={



create:async(data)=>{


const query=`

INSERT INTO Notifications

(
user_id,
message
)

VALUES

(
@user_id,
@message
)

`;

return db.query(query,data);


},




getUserNotifications:async(user_id)=>{


const query=`

SELECT *

FROM Notifications

WHERE user_id=@user_id

ORDER BY created_at DESC

`;


return db.query(query,{
user_id
});


}



};


module.exports=Notification;
