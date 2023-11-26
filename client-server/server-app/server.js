var express = require("express")
var cors = require('cors');
var bodyParser = require("body-parser");
var db = require("./database.js")

var app = express()

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Server port
var HTTP_PORT = 8080 

// Start server
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%",HTTP_PORT))
});


// Root endpoint
app.get("/", (req, res, next) => {
   res.json({"message":"Ok"})
});



// list all patients
app.get("/patient", (req, res, next) => {
    console.log("SELECT Patient.");
    let sql = `SELECT id, name, lastName, dob, address FROM patient ORDER BY id`;
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
      });
});

// Get a single patient by name
app.get("/patient/:id", (req, res, next) => {
    var sql = "select * from patient where id = ?"
    var params = [req.params.id]
    db.get(sql, params, (err, row) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":row
        })
      });
});

// Create a new patient
app.post("/patient/", (req, res, next) => {
    var errors=[]
    if (!req.body.id){
        errors.push("id for patient not specified");
    }
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }

    var data = {
        id: req.body.id,
        name: req.body.name,
        category: req.body.category,
        alergies: req.body.alergies,
        perscriptions: req.body.perscriptions
    }
    var sql ='INSERT INTO patient (id, name, category, alergies, perscriptions) VALUES (?,?,?,?,?)'
    var params =[data.id, data.name, data.category, data.alergies, data.perscriptions]
    db.run(sql, params, function (err, result) {
        if (err){
            res.status(400).json({"error": err.message})
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            "id" : this.lastID
        })
    });
});


// update patient
// we use COALESCE function to keep the current value if there is no new value (null)
app.put("/updatePatient/:id", (req, res, next) => {
    console.log("UPDATE Patient:" + req.params.id);
    var data = {
        id: req.body.id,
        name: req.body.name,
        category: req.body.category,
        alergies: req.body.alergies,
        perscriptions: req.body.perscriptions
    }
    console.log("UPDATE Patient: data.id = " + data.id);
    db.run(
        `UPDATE Patient set 
           id = COALESCE(?,id), 
           name = COALESCE(?,name), 
           category = COALESCE(?,category),
           alergies = COALESCE(?,alergies),
           perscriptions = COALESCE(?,perscriptions)  
             WHERE name = ?`,
        [data.id, data.name, data.category, data.alergies, data.perscriptions, req.params.id],
        function (err, result) {
            if (err){
                res.status(400).json({"error": res.message})
                return;
            }
            res.json({
                message: "success",
                data: data,
                changes: this.changes
            })
    });
})

// delete patient
app.delete("/deletePatient/:id", (req, res, next) => {

    console.log("DELETE Patient:" + req.params.id);

    db.run(
        'DELETE FROM Patient WHERE id = ?',
        req.params.id,
        function (err, result) {
            if (err){
                res.status(400).json({"error": res.message})
                return;
            }
            res.json({"message":"deleted", changes: this.changes})
    });
})




// Default response for any other request
app.use(function(req, res){
    res.status(404);
});