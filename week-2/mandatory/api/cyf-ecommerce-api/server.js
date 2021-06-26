const express = require("express");
const { Pool } = require("pg");

const app = express();

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "cyf_ecommerce",
  password: "1234",
  port: 5432,
});

app.get("/customers", function (req, res) {
  pool.query("SELECT * FROM customers", (error, result) => {
    res.json(result.rows);
  });
});

app.get("/suppliers", function (req, res) {
  pool.query("SELECT * FROM suppliers", (error, result) => {
    res.json(result.rows);
  });
});

app.get("/products", (req, res) => {
  pool.query(
    "SELECT p.product_name, p.unit_price, s.supplier_name from products p inner join suppliers s ON s.id = p.supplier_id",
    (error, result) => {
      res.json(result.rows);
    }
  );
});

app.listen(3000, function () {
  console.log("Server is listening on port 3000");
});
