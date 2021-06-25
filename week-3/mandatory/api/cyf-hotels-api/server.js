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

app.get("/hotels", (req, res) => {
  pool
    .query("SELECT * FROM hotels")
    .then((result) => res.json(result.rows))
    .catch((e) => console.error(e));
});

//GET endpoint "/hello-world" that returns OK -
app.get("/", (req, res) => {
  res.send("cyf-hotels-api");
});

app.listen(3000, () => console.log("Server is up and running"));
