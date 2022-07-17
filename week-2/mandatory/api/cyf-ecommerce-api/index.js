const express = require("express");
const {Pool, Client} = require("pg");
var bodyParser = require('body-parser')


const PORT = 3005;
const app = express();
app.use(bodyParser.json());



const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'cyf_ecommerce',
    password: '1994',
    port: 5432
});

app.get("/customers", function(req, res) {
    pool.query('select * from customers', (error, response) => {
        if (error) {
            console.log("Something is wrong" + error)
        }
        res.json(response.rows)
    });
});

app.get("/suppliers", function(req, res) {
    pool.query('select * from suppliers', (error, response) => {
        if (error) {
            console.log("Something is wrong" + error)
        }
        res.json(response.rows)
    });
});


app.get("/products", (req, res) => {
    const newproduct = req.query.productname
  
    const allProducts =
        "select products.product_name,suppliers.supplier_name " +
        "from products " +
        "INNER join suppliers on products.supplier_id=suppliers.id"
  
    const productByName =
        "select products.product_name,suppliers.supplier_name " +
        "from products " +
        "INNER join suppliers on products.supplier_id=suppliers.id " +
        "where products.product_name like $1"
  
    if(newproduct){
        // We have a name
        pool.query(productByName,[newproduct])
             .then((result) => res.json(result.rows))
    } else {
        // No name at all
        pool.query(allProducts)
            .then(result => {
                res.json(result.rows)
            })
    }
  });
  
  
  app.get("/customers/:customerId", (req, res) => {
    const customerId = req.params.customerId;
  
    const customersById = "select * from customers where id = $1";
  
    pool
      .query(customersById, [customerId])
      .then((result) => {
        if (result.rows.length > 0) {
          res.json(result.rows);
        } else {
          res.status(404).send(`ID does not exist`);
        }
      })
      .catch((error) => console.log("Something is wrong " + error));
  });

//Add a new POST endpoint /customers to create a new customer.


app.post("/customers", (req, res) => {
   
    const name = req.body.name;
    const address = req.body.address;
    const city = req.body.city;
    const country = req.body.country;
   
    const createCustomer = "Insert into customers (name, address, city, country) Values ($1, $2, $3, $4)";
  
    pool
      .query(createCustomer, [name, address, city, country])
      .then(() => res.send("Customer created!"))
      .catch(error => res.send(error.message));
  });
  
  
  //Add a new POST endpoint /products to create a new product (with a product name, a price and a supplier id). Check that the price is a positive integer and that the supplier ID exists in the database, otherwise return an error.


  app.post("/products", (req, res) => {
   
    const orderDate = req.body.order_date;
    const orderRef = req.body.order_reference;
    const customerId = req.params.customer_id;
   
    const createProduct = "Insert into products (order_date, order_reference, customer_id) Values ($1, $2, $3)";
  
    pool
      .query(createProduct, [orderDate, orderRef, city, customerId])
      .then(() => res.send("Product created!"))
      .catch(error => res.send(error.message));
  });


  //Add a new POST endpoint /customers/:customerId/orders to create a new order (including an order date, and an order reference) for a customer. Check that the customerId corresponds to an existing customer or return an error.


  app.post("/customers/:customerId/orders", (req, res) => {
    let orderDate = req.body.order_date;
    let orderRef = req.body.order_reference;
    let customerId = req.params.customerId;
  
    const checkCustomer = "select * from customers where id = $1";
    const insertOrder =
      "Insert into orders(order_date, order_reference, customer_id) values ($1, $2, $3)";
  
    pool
      .query(checkCustomer, [customerId])
      .then((result) => {
        if (result.rows.length > 0) {
          pool
            .query(insertOrder, [orderDate, orderRef, customerId])
            .then(() => res.send("Order created!"))
            .catch((error) =>
              console.error("Something went wrong adding the new order" + error)
            );
        } else {
          res.status(400).send(" Customer ID" + customerId + "does not exist");
        }
      })
      .catch((error) => console.error("Something is wrong" + error));
  });
  
  
  
  //Add a new PUT endpoint /customers/:customerId to update an existing customer (name, address, city and country).
  app.put("/customers/:customerId", function (req, res) {
  const customerId = req.params.customerId;
  const { name, address, city, country } = req.body;

  pool
      .query("UPDATE customers SET name=$1, address=$2, city=$3, country=$4 WHERE id=$5",
          [name, address, city, country, customerId])
      .then(() => res.send(`Customer ${customerId} updated!`))
      .catch((e) => console.error(e));

});


  
  // Add a new DELETE endpoint `/orders/:orderId` to delete an existing order along all the associated order items.
app.delete("/orders/:orderId", function (req, res) {
    const orderId = req.params.orderId;
    pool
        .query("DELETE FROM order_items WHERE order_id=$1", [orderId])
        .then(() =>
            pool
                .query("DELETE FROM orders WHERE id=$1", [orderId])
                .then(() => res.send(`Order ${orderId} deleted with its order_items!`))
                .catch((e) => console.error(e)));
});

// Add a new DELETE endpoint `/customers/:customerId` to delete an existing customer only if this customer doesn't have orders.
app.delete("/customers/:customerId", function (req, res) {
    const customerId = req.params.customerId;
    pool
        .query("SELECT * FROM orders WHERE customer_id=$1", [customerId])
        .then((result) => {
            console.log(result.rows)
            if (result.rows.length > 0) {
                return res
                    .status(400)
                    .send("This customer has orders! Deletion in not possible!");
            } else {
                pool
                    .query("DELETE FROM customers WHERE id=$1", [customerId])
                    .then(() => res.send(`Customer ${customerId} deleted!`))
                    .catch((e) => console.error(e));
            }
        });
});
  
  
  // Add a new GET endpoint `/customers/:customerId/orders` to load all the orders along the items in the orders of a specific 
// customer. Especially, the following information should be returned: order references, order dates, product names, 
//unit prices, suppliers and quantities.
app.get("/customers/:customerId/orders", function (req, res) {
  const customerId = req.params.customerId;
  let sqlQuery =
      `select o.order_reference, order_date, p.product_name, p.unit_price, s.supplier_name, oi.quantity  from orders o 
      inner join order_items oi on oi.order_id = o.id
      inner join products p on p.id = oi.product_id 
      inner join suppliers s on s.id = p.supplier_id
      inner join customers c on o.customer_id = c.id 
      where c.id = ${customerId}`
  pool
      .query(sqlQuery)
      .then((result) => res.json(result.rows))
      .catch((e) => {
          console.error(e);
          res.status(404).send({ error: error.message })
      });
});




app.listen(PORT, function(){
    console.log("running")
})