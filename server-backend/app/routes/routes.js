module.exports = app => {
    const EmpDB = require("../controllers/controller.js");

    var router = require("express").Router();

    //create new tutorial
    router.post("/", EmpDB.create);
    
    //retreive all tutorials 
    router.get("/", EmpDB.findAllFormatted);

    // Retrieve all published Tutorials
    router.get("/published", EmpDB.findAllPublished);

    // Retrieve a single Tutorial with id
    router.get("/:id", EmpDB.findOne);

    //get employeed by department
    router.get("/list/:userid", EmpDB.findbyOwnership)


    router.get("/search/:search", EmpDB.findbyNames)

    //department ownership by id
    router.get("/dept/:userid", EmpDB.departmentalOwnership)

    // Update a Tutorial with id
    router.put("/:id", EmpDB.update);

    // Delete a Tutorial with id
    router.delete("/:id", EmpDB.delete);

    // Delete all Tutorials
    router.delete("/", EmpDB.deleteAll);

app.use('/api/empDir', router);
};