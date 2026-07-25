const db = require("../config/db");

const User = {

    create: async (user) => {
        const query = `
        INSERT INTO Users 
        (name, email, password, phone, role)
        VALUES
        (@name, @email, @password, @phone, @role)
        `;

        return db.query(query, {
            name: user.name,
            email: user.email,
            password: user.password,
            phone: user.phone,
            role: user.role || "user"
        });
    },


    findByEmail: async (email) => {

        const query = `
        SELECT * FROM Users
        WHERE email=@email
        `;

        return db.query(query,{
            email
        });

    },


    findById: async(id)=>{

        const query=`
        SELECT id,name,email,phone,role
        FROM Users
        WHERE id=@id
        `;

        return db.query(query,{
            id
        });

    },


    getAll: async()=>{

        const query=`
        SELECT * FROM Users
        `;

        return db.query(query);

    }

};


module.exports = User;