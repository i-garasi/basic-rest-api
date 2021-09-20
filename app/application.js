const express = require("express");
const app = express();
const sqlite3 = require("sqlite3");
const path = require("path");

const dbPath = "app/db/database.sqlite3";

app.use(express.static(path.join(__dirname, "public")));

// get all user
app.get("/api/v1/users", (req, res) => {
  // connect database
  const db = new sqlite3.Database(dbPath);
  db.all("SELECT * FROM users", (err, rows) => {
    res.json(rows);
  });
  db.close();
});

// get single user
app.get("/api/v1/users/:id", (req, res) => {
  // connect database
  const db = new sqlite3.Database(dbPath);
  const id = req.params.id;

  db.get(`SELECT * FROM users WHERE id = ${id}`, (err, row) => {
    res.json(row);
  });
  db.close();
});

// get search user
app.get("/api/v1/search", (req, res) => {
  // connect database
  const db = new sqlite3.Database(dbPath);
  const val = req.query.q;

  db.all(`SELECT * FROM users WHERE name LIKE "%${val}%"`, (err, rows) => {
    res.json(rows);
  });
  db.close();
});

const port = process.env.PORT || 3000;
app.listen(port);
console.log("Listen on port: " + port);
