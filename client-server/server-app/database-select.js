const sqlite3 = require('sqlite3').verbose();

// open the database
let db = new sqlite3.Database('patients.db');

let sql = `SELECT id, name, category, alergies, perscriptions FROM patient
           ORDER BY id`;

db.all(sql, [], (err, rows) => {
  if (err) {
    throw err;
  }
  rows.forEach((row) => {
    console.log("id=" + row.id +"name=" + row.name +" category=" + row.category+ " alergies="+row.alergies+ " perscriptions="+row.perscriptions);
  });
});

// close the database connection
db.close();