module.exports = app => {
    const AdminTable = require("../controllers/admin-table.controller.js");

    var router = require("express").Router();

    //create new tutorial
    router.post("/", AdminTable.create);
    
    //retreive all tutorials 
    router.get("/", AdminTable.findAll);

    // Retrieve all departments
    router.get("/category", AdminTable.findCategory);

    //retrieve all locations
    router.get("/locations", AdminTable.findLocations);

    // Retrieve a single Tutorial with id
    router.get("/:id", AdminTable.findOne);

    // Update a Tutorial with id
    router.put("/:id", AdminTable.update);

    // Delete a Tutorial with id
    router.delete("/:id", AdminTable.delete);
 
    // Delete all Tutorials
    router.delete("/", AdminTable.deleteAll);

app.use('/api/admin', router);
};