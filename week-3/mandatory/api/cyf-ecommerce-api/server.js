const express = require("express");
const cors = require("cors");
const app = express();
const secret = require("./secret.json")

app.use(cors());
app.use(express.json());

const { Pool } = require('pg');
const pool = new Pool(secret);

// Allow suppliers to add the products they are providing
app.post("/customers", (req, res) => {
    const { name, address, city, country } = req.body;
    let sqlQuery =
        'INSERT INTO customers (name, address, city, country) VALUES ($1, $2, $3, $4) RETURNING id as customerId;';
    pool
        .query(sqlQuery, [name, address, city, country])
        .then((result2) => res.json(result2.rows[0]))
        .catch((e) => console.error(e));
});

//- Add a new GET endpoint `/customers` to load all the customers from the database
app.get("/customers", function (req, res) {
    pool.query('SELECT * FROM customers', (error, result) => {
        if (result) {
            res.json(result.rows);
        } else {
            res.status(404).send({ error: error.message });
        }
    })
})

app.get("/customers/:customerId", function (req, res) {
    const customerId = req.params.customerId;

    pool
        .query("SELECT * FROM customers WHERE id=$1", [customerId])
        .then((result) => res.json(result.rows))
        .catch((e) => console.error(e));
});

//- Add a new GET endpoint `/suppliers` to load all the suppliers from the database
app.get("/suppliers", function (req, res) {
    pool.query('SELECT * FROM suppliers', (error, result) => {
        if (result) {
            res.json(result.rows);
        } else {
            res.status(404).send({ error: error.message });
        }
    })
})

//- (STRETCH GOAL) Add a new GET endpoint `/products` to load all the product names along with their supplier names.
// add a new GET endpoint /products to load all the product names along with their supplier names.
// Update the previous GET endpoint /products to filter the list of products by name using a query parameter, for example /products
// name=Cup. This endpoint should still work even if you don’t use the name query parameter!


app.get("/products", function (req, res) {
    let sql = 'SELECT p.product_name, s.supplier_name FROM products p inner join suppliers s on p.supplier_id = s.id '

    const productNameQuery = req.query.name;
    if (productNameQuery) {
        sql = sql + `WHERE p.product_name LIKE '%${productNameQuery}%'`
    }
    pool
        .query(sql)
        .then((result) => res.json(result.rows))
        .catch((e) => console.error(e));
})

// get the top 5 suppliers who sell the most
app.get("/top5suppliers", function (req, res) {
    let sqlQuery =
        `select s.supplier_name, sum(oi.quantity * p.unit_price) as supplier_amount from suppliers s 
        inner join products p on s.id = p.supplier_id
        inner join order_items oi on oi.product_id = p.id 
        group by s.supplier_name
        order by supplier_amount desc limit 5;`
    pool
        .query(sqlQuery)
        .then((result) => res.json(result.rows))
        .catch((e) => {
            console.error(e);
            res.status(404).send({ error: error.message })
        });
});

// get top 3 customers that are buying more
app.get("/top3customers", function (req, res) {
    let sqlQuery =
        `select c.name, sum(oi.quantity * p.unit_price) as amount_customer_purchases from customers c 
        inner join orders o on o.customer_id = c.id 
        inner join order_items oi on oi.order_id = o.id 
        inner join products p on p.id = oi.product_id
        group by c.name
        order by amount_customer_purchases desc limit 3;`
    pool
        .query(sqlQuery)
        .then((result) => res.json(result.rows))
        .catch((e) => {
            console.error(e);
            res.status(404).send({ error: error.message })
        });
});

// get the top 2 products that are bought most times. Who is selling those products?
app.get("/top2products", function (req, res) {
    let sqlQuery =
        `select p.product_name, s.supplier_name, sum(oi.quantity * p.unit_price) as product_sales_amount from products p 
    inner join suppliers s on p.supplier_id = s.id
    inner join order_items oi on oi.product_id = p.id 
    group by p.product_name, s.supplier_name
    order by product_sales_amount desc limit 2;`
    pool
        .query(sqlQuery)
        .then((result) => res.json(result.rows))
        .catch((e) => {
            console.error(e);
            res.status(404).send({ error: error.message })
        });
});

// get the products that a customer bought based on user name
app.get("/user", function (req, res) {
    let customer = req.query.userName;
    let sqlQuery =
        `select * from products p 
        inner join order_items oi on oi.product_id = p.id
        inner join orders o on o.id = oi.order_id 
        inner join customers c on o.customer_id = c.id 
        where c.name = '${customer}';`
    pool
        .query(sqlQuery)
        .then((result) => res.json(result.rows))
        .catch((e) => {
            console.error(e);
            res.status(404).send({ error: error.message })
        });
});



// Allow suppliers to delete the products they are providing
app.delete("/product/:productId", function (req, res) {
    const productId = req.params.productId;
    pool
        .query("DELETE FROM products WHERE id=$1", [productId])
        .then(() => res.send(`Product ${productId} deleted!`))
        .catch((e) => console.error(e));
});

// set port, listen for requests
app.listen(3000, function () {
    console.log("Server is listening on port 3000. Ready to accept requests!");
});