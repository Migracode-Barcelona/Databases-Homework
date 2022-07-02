const express = require("express");
const {Pool, Client} = require("pg");

const PORT = 3005;
const app = express();


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



app.get("/products", function(req, res) {
    pool.query('select products.product_name, suppliers.supplier_name from products join suppliers on products.supplier_id = suppliers.id;', (error, response) => {
        if (error) {
            console.log("Something is wrong" + error)
        }
        res.json(response.rows)
    });
});


app.listen(PORT, function(){
    console.log("running")
})