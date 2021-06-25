//GET endpoint called /hello-world that returns OK - body : "hello-world"
const express = require("express");
const app = express();
const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "cyf_hotels_exercises",
  password: "1234",
  port: 5432,
});

app.get("/", (req, res) => {
  res.send("Hello");
});

app.get("/hello-world", (req, res) => {
  res.send("Hello-World");
});

app.get("/hotels", function (req, res) {
  pool.query("SELECT * FROM hotels where id=2", (error, result) => {
    res.json(result.rows);
  });
});

app.get("/customers", function (req, res) {
  pool.query("SELECT * FROM customers where id=1", (error, result) => {
    res.send(result.rows);
  });
});

app.listen(3000, () => console.log("Server is up and running"));
