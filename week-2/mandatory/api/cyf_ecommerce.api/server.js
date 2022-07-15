require('dotenv').config()
const express = require('express')
const app = express()
const port = 3000
const { Pool} = require('pg')
const pool=new Pool();

// Add a new GET endpoint `/customers` to load all the customers from the database
app.get('/customers',(req,res)=>{
    pool.query("select * from customers").then(result=>{
        res.send(result.rows)
    })
})
//Add a new GET endpoint `/suppliers` to load all the suppliers from the database

app.get('/suppliers',(req,res)=>{
    pool.query("select * from suppliers").then(result=>{
        res.send(result.rows)
    })
})
//- (STRETCH GOAL) Add a new GET endpoint `/products` to load all the product names along with their supplier names.
app.get('/products',(req,res)=>{
    pool.query("select product_name,supplier_name from products join suppliers on suppliers.id=products.supplier_id ").then(result=>{
        res.send(result.rows)
    })
})
//- Update the previous GET endpoint `/products` to filter the list of products by name using a query parameter,
 //for example `/products?name=Cup`. This endpoint should still work even if you don't use the `name` query parameter!
 

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
