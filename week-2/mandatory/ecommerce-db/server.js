const express = require('express');
const  {Pool, Client} = require('pg');
const app = express();
const port = 3001
//app.use(express.urlencoded({extended}))

const pool = new Pool({
    user: 'usman',
    host: 'localhost',
    database: 'cyf_ecommerce',
    password: 'usman0987.',
    port: 5432
});

app.get("/orders", function(req, res) {
   
    pool.query('SELECT * FROM orders', (error, result) => {
        if (error) {
            console.log("Something is wrong " + error)
        }
        res.json(result.rows);
    });
});
app.get("/customers", function(req, res) {
    pool.query('SELECT * FROM customers',(error,result) =>{
        if (error){
            console.log("Something is wrong " + error)
        }
        res.json(result.rows);
    });
});
app.listen(port, function(){
    console.log('server is listening on 30001 ')
});