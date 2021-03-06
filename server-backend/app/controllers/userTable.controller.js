const db = require("../models");            //pulls in the /models/index.js file, we're pulling the "db" variable out of  
const UserTable = db.user_table;
const Op = db.Sequelize.Op;

// Create and Save a new User in the UserTable in MySQL
exports.createUser = (req, res) => {
  // Generate a random Unique User ID (UUID)

  function makeUUID(length) {
      var result           = [];
      var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      var charactersLength = characters.length;

      for ( var i = 0; i < length; i++ ) {
          result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
        }
        return result.join('');
    }

    var UUID = makeUUID(6);

    const userInfo = {
        user_id: UUID,
        userName: req.body.userName,
        ad_auth: req.body.ad_auth, 
        role:null
    }

    // Save item  in the database
    UserTable.create(userInfo)
    .then(data => {
        res.send(data);

    })
    .catch(err => {
        res.status(500).send({
        message:
            err.message || "Some error occurred while creating the AdminTable."
        });
    });
};





// Retrieve all EmpDBs from the 
exports.getAllUsers = (req, res) =>{
  UserTable.findAll()
  .then(data=>{
    res.send(data);
  })
}

exports.getUserByID = (req, res) =>{
  const id = req.params.id;

  UserTable.findByPk(id)
  .then(data =>{
    res.send(data);
  })
 }