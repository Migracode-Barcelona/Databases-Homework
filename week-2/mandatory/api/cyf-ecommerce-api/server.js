const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Pool } = require("pg");
const app = express();
var corsOptions = {
  origin: "http://localhost:8081"
};

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'cyf_ecommerce',
    password: 'postgres',
    port: 5432
});

app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// route to customers
app.get("/customers", (req, res) => {
    pool.query('select * from customers', (error, response) => {
        if (error){
            console.log("Something went wrong" + error);
        }
        res.json(response);
    });
});

// route to suppliers
app.get("/suppliers", (req, res) => {
    pool.query('select * from suppliers', (error, response) => {
        if (error){
            console.log("Something went wrong" + error);
        }
        res.json(response);
    });
});

// route to products
app.get("/products", (req, res) => {
    pool.query('select p.product_name, s.supplier_name  from products p join suppliers s on p.supplier_id = s.id', (error, response) => {
        if (error){
            console.log("Something went wrong" + error);
        }
        res.json(response);
    });
});
// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
  //console.log(first);
});