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



const selectProducts = `SELECT p.product_name , s.supplier_name 
    FROM suppliers s INNER JOIN products p on p.supplier_id = s.id 
    WHERE p.id = $1`
;
const selectCustomerById = `SELECT * FROM customers WHERE id = $1`
const selectedCustomer = `SELECT name FROM customers WHERE name = $1`
const createCustomer = `INSERT INTO customers (name, address, city, country) VALUES ($1, $2, $3, $4)`
const updateCustomer = `UPDATE customers SET name = $1, address = $2, city = $3, country = $4 WHERE id = $5`

const selectSupplier = `SELECT * FROM suppliers WHERE id = $1`
const createProduct = `INSERT INTO products (product_name, unit_price, supplier_id) VALUES ($1, $2, $3)`

const createOrder = `INSERT INTO orders (order_date, order_reference, customer_id) VALUES ($1, $2, $3)`

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
app.post('/customers/:customerId/orders', function (req, res) {
    let customer_id = parseInt(req.params.customerId)
    let {order_date, order_reference} = req.body
    let values = [order_date, order_reference, customer_id]

    if (!order_date || !order_reference || !customer_id) {
        return res.send('Order is invalid')
    }
    pool.connect( (err, client, release) => {
        if (err) {
            res.send('Error acquiring client')
        };
        client.query(selectCustomerById, [customer_id], (err, result) => {
            if(result.rowCount < 1) {
                res.send('This customer does not exists')
            } else {
                client.query(createOrder, values, (err, result) => {
                    release
                    if (err) {
                        res.send(err.message)
                    }
                    res.status(201).send(`The order was realized, please check your email`)
                })
            }
            
        })
        
    })

})
app.put('/customers/:customerId', function (req, res) {
    let customer_id = parseInt(req.params.customerId)
    let {name, address, city, country} = req.body
    let values = [name, address, city, country, customer_id]  

    pool.connect((err, client, release) => {
        if (err) {
            res.send('Error acquiring client')
        }
        client.query(selectCustomerById, [customer_id], (err, result) => {
            if (err) {
                res.send('Error excecuting query')
            }
            if (result.rowCount < 1) {
                res.send('The customer with this id does not exist')
            }
            client.query(updateCustomer, values, (err, result) => {
                res.status(201).send('The customer was updated')
            })
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
app.post('/products', function (req, res) {
    let {product_name, unit_price, supplier_id} = req.body
    let values = [product_name, unit_price, supplier_id]
    //como verifico que ese producto no existe por el mismo supplier?
    pool.connect( (err, client, release) => {
        if (err) {
            return res.send('Error acquiring client')
        }
        client.query(selectSupplier, [supplier_id], (err, result) => {
            if(err) {
                return res.status(500).send(err.message)
            }
            if( result.rowCount < 1) {
                return res.send('The supplier does not exist yet, please insert new supplier')
            }
            if (Number(unit_price) === NaN) {
                return res.send('Unit price Must be a integer')
            }
            client.query(createProduct, values, (err, result) => {
                release
                if (err) {
                    
                    res.send('Error excecuting query')
                }
                console.log(result.rows)
                res.status(201).send(`Product  was created`)
            })
        })
    })

})



const port = 3000
app.listen(port, () => console.log(`Server is running on PORT ${port}`))
