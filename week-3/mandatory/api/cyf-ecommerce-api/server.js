const express = require("express");
const app = express();
const { Pool } = require("pg");
const secret = require("./secret.json");
const pool = new Pool(secret);

app.get("/customers", function (req, res) {
  pool.query("SELECT * FROM customers", (error, result) => {
    res.json(result.rows);
  });
});

app.get("/suppliers", (req, res) => {
  pool.query("SELECT * FROM suppliers", (error, result) => {
    res.json(result.rows);
  });
});

app.get("/products", (req, res) => {
  pool.query(
    "SELECT p.product_name, s.supplier_name FROM products p INNER JOIN suppliers s ON s.id = p.supplier_id",
    (error, result) => {
      res.json(result.rows);
    }
  );
});

app.listen(3000, () => console.log("Server is up and running"));
