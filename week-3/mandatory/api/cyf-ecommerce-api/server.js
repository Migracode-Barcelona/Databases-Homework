const express = require("express");
const cors = require("cors");
const app = express();
const secret = require("./secret.json")

app.use(cors());
app.use(express.json());

const { Pool } = require('pg');
const { json } = require("express");
const pool = new Pool(secret);

// Add a new POST endpoint `/customers` to create a new customer.
app.post("/customers", (req, res) => {
    const { name, address, city, country } = req.body;
    let sqlQuery =
        'INSERT INTO customers (name, address, city, country) VALUES ($1, $2, $3, $4) RETURNING id as customerId;';
    pool
        .query(sqlQuery, [name, address, city, country])
        .then((result2) => res.json(result2.rows[0]))
        .catch((e) => console.error(e));
});


// Add a new POST endpoint `/products` to create a new product (with a product name, a price and a supplier id). 
// Check that the price is a positive integer and that the supplier ID exists in the database, otherwise return an error.
app.post("/products", function (req, res) {
    const { product_name, unit_price, supplier_id } = req.body;
    if (!Number.isInteger(unit_price) || unit_price <= 0) {
        return res
            .status(400)
            .send("The unit_price should be a positive integer.");
    }
    pool
        .query("SELECT * FROM suppliers WHERE id=$1", [supplier_id])
        .then((result) => {
            if (result.rows.length == 0) {
                return res
                    .status(400)
                    .send(`Error. A supplier with supplier_id = ${supplier_id} not found.`);
            } else {
                const query =
                    "INSERT INTO products (product_name, unit_price, supplier_id) VALUES ($1, $2, $3) RETURNING id as product_Id";
                pool
                    .query(query, [product_name, unit_price, supplier_id])
                    .then((result2) => {
                        res.send(`Product was added with id = ${result2.rows[0].product_id}`)
                    })
                    .catch((e) => console.error(e));
            }
        });
});

// Add a new POST endpoint `/customers/:customerId/orders` to create a new order (including an order date, and an order reference)
// for a customer. Check that the customerId corresponds to an existing customer or return an error.
app.post("/customers/:customerId/orders", function (req, res) {
    const { order_date, order_reference, customer_id } = req.body;

    pool
        .query("SELECT * FROM customers WHERE id=$1", [customer_id])
        .then((result) => {
            if (result.rows.length == 0) {
                return res
                    .status(400)
                    .send(`Error. A customer with customer_id = ${customer_id} not found. Order has not been added`);
            } else {
                const query =
                    "INSERT INTO orders (order_date, order_reference, customer_id) VALUES ($1, $2, $3) RETURNING id";
                pool
                    .query(query, [order_date, order_reference, customer_id])
                    .then((result2) => {
                        res.send(`Order added with id = ${result2.rows[0].id}`)
                    })
                    .catch((e) => console.error(e));
            }
        });
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

// Add a new PUT endpoint `/customers/:customerId` to update an existing customer (name, address, city and country).
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