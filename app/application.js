const express = require("express");
const app = express();
const sqlite3 = require("sqlite3");
const path = require("path");
const bodyParser = require("body-parser");
const { resolve } = require("path");

const dbPath = "app/db/database.sqlite3";

// リクエストボディをパース
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// publicディレクトリを静的ファイルのルートディレクトリとして設定
app.use(express.static(path.join(__dirname, "public")));

// run関数
const run = async (db, sql, res, message) => {
  return new Promise((resolve, reject) => {
    db.run(sql, (err) => {
      if (err) {
        res.status(500).send(err);
        return reject();
      } else {
        res.json({ message: message });

        return resolve();
      }
    });
  });
};

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

  db.get(`SELECT * FROM users WHERE id=${id}`, async (err, row) => {
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

// create a new user
app.post("/api/v1/users", async (req, res) => {
  // connect database
  const db = new sqlite3.Database(dbPath);

  const name = req.body.name ? req.body.name : "";
  const profile = req.body.profile ? req.body.profile : "";
  const dateOfBirth = req.body.date_of_birth ? req.body.date_of_birth : "";

  await run(
    db,
    `INSERT INTO users (name, profile, date_of_birth) VALUES ("${name}", "${profile}", "${dateOfBirth}")`,
    res,
    "新規ユーザーを作成しました"
  );
  db.close();
});

// update user
app.put("/api/v1/users/:id", async (req, res) => {
  // connect database
  const db = new sqlite3.Database(dbPath);
  const id = req.params.id;

  db.get(`SELECT * FROM users WHERE id=${id}`, async (err, row) => {
    const name = req.body.name ? req.body.name : row.name;
    const profile = req.body.profile ? req.body.profile : row.profile;
    const dateOfBirth = req.body.date_of_birth
      ? req.body.date_of_birth
      : row.date_of_birth;

    await run(
      db,
      `UPDATE users SET name="${name}", profile="${profile}", date_of_birth="${dateOfBirth}" WHERE id=${id}`,
      res,
      "ユーザー情報を更新しました"
    );
  });
  db.close();
});

// delete user
app.delete("/api/v1/users/:id", async (req, res) => {
  // connect database
  const db = new sqlite3.Database(dbPath);
  const id = req.params.id;

  await run(
    db,
    `DELETE FROM users WHERE id=${id}`,
    res,
    "ユーザー情報を削除しました"
  );

  db.close();
});

const port = process.env.PORT || 3000;
app.listen(port);
console.log("Listen on port: " + port);
