const express = require("express");
const app = express();

const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'cyf_ecommerce',
    password: 'fran1985',
    port: 5432
});
app.get("/customers", function(req, res) {
    pool.query('SELECT * FROM customers', (error, result) => {
        res.json(result.rows);
    });
});

app.get("/suppliers", function(req, res) {
    pool.query('SELECT * FROM suppliers', (error, result) => {
        res.json(result.rows);
    });
});
// (STRETCH GOAL) Add a new GET endpoint /products to load all the product names along with their supplier names.
app.get("/products&suppliers", (req, res)=>{
    pool.query(
        'select product_name, supplier_name from products join suppliers on suppliers.id=products.supplier_id order by supplier_name', 
        (error, result)=>{
            res.json(result.rows)
        })
})

app.listen(3000, function() {
    console.log("Server is listening on port 3000. Ready to accept requests!");
});