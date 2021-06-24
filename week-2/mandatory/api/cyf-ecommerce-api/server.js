const express = require("express");
const app = express();
const { Ecommerce } = require("node-postgres");

const ecommerce = new Ecommerce({
  user: "postgres",
  host: "localhost",
  database: "cyf_ecommerce",
  password: "660182",
  port: 5432,
});

app.get("/customers", (req, res) => {
  ecommerce.query("SELECT * FROM customers", (error, result) => {
    res.json(result.rows);
  });
});

app.get("/suppliers", (req, res) => {
  ecommerce.query("SELECT * FROM suppliers", (error, result) => {
    res.json(result.rows);
  });
});

app.get("/products", (req, res) => {
  ecommerce.query(
    "SELECT p.product_name, s.supplier_name FROM products p INNER JOIN supplier s ON s.id = p.supplier_id",
    (error, result) => {
      res.json(result.rows);
    }
  );
});

app.listen(3000, () => console.log("Server is up and running"));
