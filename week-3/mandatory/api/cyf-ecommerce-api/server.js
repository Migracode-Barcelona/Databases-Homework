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

// Update the previous GET endpoint `/products` to filter the list of products by name using a query parameter, for example `/products?name=Cup`. This endpoint should still work even if you don't use the `name` query parameter!

app.get("/products", (req, res) => {
  const product = req.query.product;
  let query =
    "SELECT p.product_name, s.supplier_name FROM products p inner join suppliers s on p.supplier_id = s.id ";

  if (product) {
    query = query + `WHERE p.product_name LIKE '%${product}%'`;
  }
  pool
    .query(query)
    .then((result) => res.json(result.rows))
    .catch((error) => console.error(error));
});

//Add a new GET endpoint `/customers/:customerId` to load a single customer by ID.

app.get("/customers/:customerId", (req, res) => {
  const customerId = req.params.customerId;

  pool
    .query(`SELECT * FROM customers WHERE id=${customerId}`)
    .then((result) => {
      result.rows.length <= 0
        ? res.status(400).send("Customer doesn't exist!")
        : res.json(result.rows);
    })
    .catch((error) => console.error(error));
});

//Add a new POST endpoint `/customers` to create a new customer.

//Add a new POST endpoint `/products` to create a new product (with a product name, a price and a supplier id). Check that the price is a positive integer and that the supplier ID exists in the database, otherwise return an error.

//Add a new POST endpoint `/customers/:customerId/orders` to create a new order (including an order date, and an order reference) for a customer. Check that the customerId corresponds to an existing customer or return an error.

//Add a new PUT endpoint `/customers/:customerId` to update an existing customer (name, address, city and country).
// app.put();

//Add a new DELETE endpoint `/orders/:orderId` to delete an existing order along all the associated order items.
// app.delete("/orders/:ordererId", (req, res) => {});

//Add a new DELETE endpoint `/customers/:customerId` to delete an existing customer only if this customer doesn't have orders.
app.delete("/customers/:customerId", (req, res) => {
  const customerId = req.params.customerId;

  pool
    .query(
      `SELECT * FROM customers c INNER JOIN orders o ON c.id = o.customer_id WHERE c.id=${customerId}`
    )
    .then((result) => {
      if (result.rows.length > 0) {
        res
          .status(400)
          .send("This customer has an order and cannot be deleted!");
      } else {
        pool
          .query(`DELETE FROM customers WHERE id=${customerId}`)
          .then((result) => res.send(`Customer ${customerId} deleted!`))
          .catch((error) => console.error(error));
      }
    })
    .catch((error) => console.error(error));
});

//Add a new GET endpoint `/customers/:customerId/orders` to load all the orders along the items in the orders of a specific customer. Especially, the following information should be returned: order references, order dates, product names, unit prices, suppliers and quantities.
app.get("/customers/:customerId/orders", (req, res) => {
  const customerId = req.params.customerId;

  pool
    .query(
      `SELECT c.name, o.order_reference, o.order_date, p.product_name, p.unit_price, s.supplier_name, oi.quantity FROM customers c INNER JOIN orders o ON c.id = o.customer_id INNER JOIN order_items oi ON o.id = oi.order_id INNER JOIN products p ON p.id = oi.product_id INNER JOIN suppliers s ON s.id = p.supplier_id WHERE c.id = ${customerId} `
    )
    .then((result) => res.json(result.rows))
    .catch((error) => console.error(error));
});

//GET default endpoint to confirm which project we are working with
app.get("/", (req, res) => {
  res.send("ecommerce-api");
});

app.listen(3000, () => console.log("Server is up and running"));
