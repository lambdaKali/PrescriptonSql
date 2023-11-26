var sqlite3 = require('sqlite3').verbose()

// open the database
let db = new sqlite3.Database('patients.db', (err) => {
    if (err) {
      console.error(err.message);
      throw err
    }
    console.log('Connected to the Patient database.');
  });


  // create table 'patient'
  const sql='CREATE TABLE patient(id INTEGER PRIMARY KEY, name text NOT NULL, category text NOT NULL, alergies text NOT NULL, perscriptions text NOT NULL)';
  db.run(sql, (err) => {
    if (err) {
        // Table already created 
        console.log('Table already created.');
    }else{
      console.log('Table created.');
      
      // First time Table created, insert some rows
      console.log('First time Table created, creating some rows.');
      
      
      db.run('INSERT INTO patient(id, name, category, alergies, perscriptions)values(1,"Jamie", "A", "no","yes")', function(err, row){
        if(err){
          console.log(err.message)
        }
        console.log("Entry added")
      })
    }
  });

module.exports = db