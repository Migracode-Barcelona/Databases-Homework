const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const { Pool } = require("pg");
const secret = require("./secret.json");
const pool = new Pool(secret);
app.use(bodyParser.json());

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
app.post("/customers", (req, res) => {
  const newName = req.body.name;
  const newAddress = req.body.address;
  const newCity = req.body.city;
  const newCountry = req.body.country;

  /* BODY */
  // {
  //       "name": "",
  //       "address": "",
  //       "city": "",
  //       "country": ""
  // }

  const query =
    "INSERT INTO customers (name, address, city, country) VALUES ($1, $2, $3, $4) returning id as customerId";
  //return id as customerId - Selectively renames the information that is returned as a name that may be more user-friendly for the customer when they get their response but has no impact on the database

  pool
    .query(query, [newName, newAddress, newCity, newCountry])
    .then((result) => res.json(result.rows[0]))
    .catch((error) => console.error(error));
});

//Add a new POST endpoint `/products` to create a new product (with a product name, a price and a supplier id). Check that the price is a positive integer and that the supplier ID exists in the database, otherwise return an error.
app.post("/products", (req, res) => {
  const newProductName = req.body.product_name;
  const newUnitPrice = req.body.unit_price;
  const newSupplierId = req.body.supplier_id;

  if (!Number.isInteger(newUnitPrice) || newUnitPrice <= 0) {
    return res.status(400).send("The unit price should be a positive integer.");
  }
  pool
    .query("SELECT * FROM products where supplier_id=$1", [newSupplierId])
    .then((result) => {
      if (result.rows.length <= 0) {
        return res
          .status(400)
          .send(
            "The supplier ID does not match with any existing suppliers. Create a new supplier first before adding a product."
          );
      } else {
        pool
          .query(
            "INSERT INTO products (product_name, unit_price, supplier_id) VALUES ($1, $2, $3)",
            [newProductName, newUnitPrice, newSupplierId]
          )
          .then(() => res.send("New product added!"))
          .catch((error) => console.error(error));
      }
    })
    .catch((error) => console.error(error));
});

//Add a new POST endpoint `/customers/:customerId/orders` to create a new order (including an order date, and an order reference) for a customer. Check that the customerId corresponds to an existing customer or return an error.
app.post("/customers/:customerId", (req, res) => {
  const customerId = req.params.customerId;

  const newOrderDate = req.body.order_date;
  const newOrderReference = req.body.order_reference;
  const newCustomerId = req.body.customer_id;

  pool
    .query("SELECT * FROM customers WHERE id = $1", [customerId])
    .then((result) => {
      if (result.rows.length <= 0) {
        return res
          .status(400)
          .send(
            "There is no customer registered with that ID. Please register a new customer profile first before making your order."
          );
      } else {
        pool
          .query(
            "INSERT INTO orders (order_date, order_reference, customer_id) VALUES ($1, $2, $3)",
            [newOrderDate, newOrderReference, newCustomerId]
          )
          .then(() => res.send("Order success!"))
          .catch((error) => console.error(error));
      }
    })
    .catch((error) => console.error(error));
});

//Add a new PUT endpoint `/customers/:customerId` to update an existing customer (name, address, city and country).
// app.put();

//Add a new DELETE endpoint `/orders/:orderId` to delete an existing order along all the associated order items.
app.delete("/orders/:ordererId", (req, res) => {
  const orderId = req.params.ordererId;

  pool
    .query(`DELETE FROM order_items WHERE order_id=${orderId}`)
    .then(() => {
      pool
        .query(`DELETE FROM orders WHERE id=${orderId}`)
        .then(() => res.send(`Order #${orderId} deleted!`))
        .catch((error) => console.error(error));
    })
    .catch((error) => console.error(error));
});

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
          .then(() => res.send(`Customer ${customerId} deleted!`))
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
