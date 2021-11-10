const express = require("express");
const app = express();
app.use(express.json());

const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'cyf_ecommerce',
    password: 'fran1985',
    port: 5432
});

app.get("/customers", function(req, res) {
    pool.query('SELECT * FROM customers')
    .then(result => res.json(result.rows))
    .catch(error => res.send(error) )
    });
    
    //Add a new GET endpoint `/customers/:customerId` to load a single customer by ID.
app.get("/customers/:customerId", (req, res)=>{
    const customerId = req.params.customerId;
    const query = "select * from customers where id = $1";
    pool
        .query(query, [customerId])
        .then(result => res.json(result.rows))
        .catch(e => res.send(e))
})

//- Add a new POST endpoint `/customers` to create a new customer.

app.post("/customers", (req, res)=>{
    console.log("req.body", req.body)
    const newName = req.body.name;
    const newAddress = req.body.address;
    const newCity = req.body.city;
    const newCountry = req.body.country;
    const query = "insert into customers (name, address, city, country) values ($1, $2, $3, $4)";
    if(typeof newName !== "string" || typeof newAddress !== "string" || typeof newCity !== "string" ||typeof newCountry !== "string"){
        return res 
                .status(500)
                .send("Not correct!")
    }
    pool
        .query(query, [newName, newAddress, newCity, newCountry])
        .then(result => res.send("customer finally added!"))
        .catch(e => 
            {res.send(e), console.error(e)})
}
)
//Add a new POST endpoint `/customers/:customerId/orders` to create a new order 
//(including an order date, and an order reference) for a customer. 
//Check that the customerId corresponds to an existing customer or return an error.

//>>>>>>>>>>>>>>>NO TERMINADO<<<<<<<<<<<<<<

app.post("/customers/:customerId/orders", async (req, res)=>{
    const customerParamsId = req.params.customerId;
    const newOrderDate = req.body.order_date
    const newOrderReference = req.body.order_reference
    const customerId = req.body.customer_id
    console.log("cust params id > ", parseInt(customerParamsId));
    console.log("cust body id > ", customerId);

    try {
        const customerExist = await pool.query("select * from orders where customer_id = $1", [customerParamsId])
console.log("customerExist.rowCount>>> ", customerExist.rowCount);
        if (customerExist.rowCount === 0 ){
        return res 
        .status(500)
        .send({error: "the customer does not exist"})
    }
}catch (error) {
    console.error(error);
    res.status(500).send("something went wrong")
  } 
    const query = "insert into orders (order_date, order_reference) values ($1, $2)";
    pool.query(query, [newOrderDate, newOrderReference])
        .then(results => res.json("Yout order was submitted"))
        .catch(error => console.error(error))
})

app.get("/suppliers", function(req, res) {
    pool.query('SELECT * FROM suppliers', (error, result) => {
        res.json(result.rows);
        
    });
});
//- Update the previous GET endpoint `/products` to filter the list of products by name using a query parameter, 
//for example `/products?name=Cup`. This endpoint should still work even if you don't use the `name` query parameter!
app.get("/products", (req, res)=>{
    const productName = req.query.product_name;

    const query = 'select * from products where product_name = $1';
    pool
        .query(query, [productName])
        .then(result => res.json(result.rows))
        .catch(error => res.status(400).send(error))
})
//Add a new POST endpoint `/products` to create a new product (with a product name, a price and a supplier id). 
//Check that the price is a positive integer and that the supplier ID exists in the database, otherwise return an error.
app.post("/products",  async (req,res)=>{
   // console.log(req);
    const newProduct =req.body.product_name;
    const newProPrice = req.body.unit_price;
     const supplierId = req.body.supplier_id;

    const supplierIdExist =  await pool.query("select count(*) from products where supplier_id = $1", [supplierId])
                                .then((result)=>  Math.floor(result.rows[0].count))
                                //  .catch(error => res.status(500).send(error))
    console.log('supplierIdExist', supplierIdExist);
    if (supplierIdExist < 1 )  {
      return res 
        .status(400)
        .send("the supplier does not exist")
    } else if (!Number.isInteger(newProPrice)) {
        return res 
                .status(500)
                .send({error: "The price is not valid"})
    }
    const query = "insert into products (product_name, unit_price, supplier_id) values ($1, $2, $3)";
    pool.query(query, [newProduct, newProPrice, supplierId])
    .then(() => res.send("Product succesfully added"))
    .catch((e) => console.error(e));
   
})

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