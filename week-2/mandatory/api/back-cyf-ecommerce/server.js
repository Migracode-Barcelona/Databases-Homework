const express = require("express");
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config()
const app = express();

const corsOptions = {
    origin: 'http://localhost:3000'
};
app.use(cors(corsOptions));

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'cyf_ecommerce',
    password: process.env.PGPASSW,
    port: 5432
})

//Database querys
const selectProdByName = `SELECT p.*, supplier_name 
FROM products p JOIN suppliers s ON p.supplier_id = s.id
WHERE p.product_name = $1`

const selectCustomerById = `SELECT * FROM customers WHERE id = $1`

const selectProducts = `select p.product_name , s.supplier_name 
    from suppliers s inner join products p on p.supplier_id = s.id 
    where p.id = $1`
;

const selectedCustomer = `SELECT name FROM customers WHERE name = $1`
const createCustomer = `INSERT INTO customers (name, address, city, country) VALUES ($1, $2, $3, $4)`

app.use(express.json());

app.get('/customers', function (req, res) {
    pool.query('SELECT * FROM customers', (error, result) => {
        res.status(200).json(result.rows)
    })
})
app.get('/customers/:id', function (req, res) {
    let customerId = parseInt(req.params.id)

    if ( customerId === NaN) {
        return res.send('The values must be an integer')
    }//Por que no se ejecuta esto?

    pool.connect( (err, client, release) => {
        if (err) {
            res.send('Error acquiring client', err.stack)
        }
        
        client.query(selectCustomerById, [customerId], (err, result) => {
            release
            if (err) {
                res.send('Error excecuting query')
            }
            if (result.rowCount === 0) {
                res.send('This customer does not exist')
            }
            res.status(200).send(result.rows)
            
        })
    }) 
});
app.post('/customers', function (req, res) {
    let {name, address, city, country} = req.body;
    let values = [name, address, city, country]

    if (!name || !address || !city || !country) {
        return res.send('Customer is invalid')
    }

    pool.connect( (err, client, release) => {
        if (err) {
            res.send('Error acquiring client')
        };
        client.query(selectedCustomer, [name], (err, result) => {
            if(result.rowCount > 0) {
                res.send('This customer already exists')
            } else {
                client.query(createCustomer, values, (err, result) => {
                    release
                    res.status(200).send('New customer posted')
                })
            }
            
        })
        
    })
})
app.get('/suppliers', function (req, res) {
    pool.query('SELECT * FROM suppliers', (error, result) => {
        res.status(200).json(result.rows)
    })
})
app.get('/products', function (req, res) {
    let name = req.query.name

    pool.query(selectProdByName, [name],
        (error, result) => {
            res.status(200).json(result.rows)
        }
    )
})


app.get("/products/:product_id", async (request, response) => { 
    let par = parseInt(request.params.product_id) 
    let max = 0; 

    const queryResult = await pool.query(`select max(p.id) as maximo from products p`) 
    max = queryResult.rows[0].maximo; 
    
    if (par && (par > 0 && par <= max)) { 
        pool.query(selectProducts, [par], (error, result) => { 
            response.json(result.rows); }); 
    } else { 
            response.status(400).send("input no valid"); 
    }
});



const port = 3000
app.listen(port, () => console.log(`Server is running on PORT ${port}`))
