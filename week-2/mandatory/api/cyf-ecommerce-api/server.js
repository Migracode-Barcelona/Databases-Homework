const express = require("express");

const app = express();

app.use(express.json())


const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'cyf_ecommerce',
    password: '1234qwer',
    port: 5432
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
app.get("/products", function (req, res) {
    pool.query('SELECT p.product_name, s.supplier_name FROM products p inner join suppliers s on p.supplier_id = s.id', (error, result) => {
        if (result) {
            res.json(result.rows);
        } else {
            res.status(404).send({ error: error.message });
        }
    })
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


// set port, listen for requests
app.listen(3000, function () {
    console.log("Server is listening on port 3000. Ready to accept requests!");
});