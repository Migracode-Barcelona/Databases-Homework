const express = require("express");
const app = express();
const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "cyf_hotels_exercise5",
  password: "660182",
  port: 5432,
});

app.get("/hotels", function (req, res) {
  pool.query("SELECT * FROM hotels where id=2", (error, result) => {
    res.json(result.rows);
  });
});

app.get("/customers", function (req, res) {
  pool.query("SELECT * from customers", (error, result) => {
    res.json(result.rows);
  });
});

//GET endpoint "/hello-world" that returns OK -
app.get("/hello-world", (req, res) => {
  res.send("OK");
});

app.listen(3000, () => console.log("Server is up and running"));
