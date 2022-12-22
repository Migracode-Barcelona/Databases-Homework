const express = require('express');
const  {Pool, Client} = require('pg');
const bodyParser = require("body-parser");

const { user } = require('pg/lib/defaults');
const res = require('express/lib/response');

const app = express();
const port = 3001
app.use(bodyParser.json());
//app.use(express.urlencoded({extended}))

const pool = new Pool({
    user: 'usman',
    host: 'localhost',
    database: 'cyf_ecommerce',
    password: 'usman0987.',
    port: 5432
});
app.get("/products", (req, res) => {
    const newproduct = req.query.productname
  
    const allProducts =
        "select products.product_name,suppliers.supplier_name " +
        "from products " +
        "INNER join suppliers on products.supplier_id=suppliers.id"
  
    const productByName =
        "select products.product_name,suppliers.supplier_name " +
        "from products " +
        "INNER join suppliers on products.supplier_id=suppliers.id " +
        "where products.product_name like $1"
  
    if(newproduct){
        pool.query(productByName,[newproduct])
             .then((result) => res.json(result.rows))
    } else {
        pool.query(allProducts)
            .then(result => {
                res.json(result.rows)
            })
    }
  });
  // Add a new GET endpoint /customers/:customerId to load a single customer by ID
  app.get('/customers/:customerId', (req,res)=>{
      const customerId = req.params.customerId;
      const customerById = 'select * from customers where id = $1';
      pool.query(customerById,[customerId])
      .then((result)=> res.json(result.rows))
      .catch((error) =>console.log('there is error ' + error))

  })
  // Add a new POST endpoint /customers to create a new customer.
  app.post('/customers', (req,res)=>{
    const customerName = req.body.name;
    const customerAddress = req.body.address;
    const customerCity = req.body.city;
    const customerCountry = req.body.country;
   
    const insertCustomer = 'INSERT INTO customers (name,address,city,country) VALUES($1, $2, $3, $4)';
    pool.query(insertCustomer,[customerName,customerAddress,customerCity,customerCountry])
    .then(() => res.send('customer created'))
    .catch((error) => console.log('there is error' + error))

  })
  // Add a new POST endpoint /products to create a new product (with a product name, a price and a supplier id).
  // Check that the price is a positive integer and that the supplier ID exists in the database, otherwise return an error.
//   app.post('/products/:supplierId', (req,res)=>{
//       const supplierId =req.params.supplierId;
//       const productName = req.body.product_name;
//       const productPrice = req.body.unit_price;
      
//       const chekSupplierId= "select * from suppliers where id = $1";
//       console.log(chekSupplierId)
//       const newProduct = "insert into products(product_name, unit_price, supplier_id ) Values($1, $2, $3)";
//       console.log(newProduct)
//       pool
//       .query(chekSupplierId,[supplierId])
//       .then(result =>{
//           if(result.rows.length > 0){
//               pool.query(newProduct,[supplierId,productName, productPrice])
//               .then(()=> res.send('newProduct created'))
//               .catch(error =>console.error('something is worng when adding product' + error))
//           }else{
//             res.status(400).send("supplier_id " + supplierId + " does not exist")
//           }
//       })
//       .catch(error => console.error("Something is wrong " + error))
//   }) ///
  // Add a new POST endpoint /customers/:customerId/orders to create a new order (including an order date, and an order reference)
  // for a customer. Check that the customerId corresponds to an existing customer or return an error
  app.post("/customers/:customerId/orders", (req, res) => {
    let customerId = req.params.customerId;
    let orderDate = req.body.order_date;
    let orderRef = req.body.order_reference;

    const checkCustomer = "select * from customers where id = $1"
    console.log(checkCustomer)
    const insertOrder = "insert into orders(order_date, order_reference, customer_id) values($1, $2, $3)";
    pool.query(checkCustomer, [customerId])
        .then(result => {
            if (result.rows.length > 0) {
                pool.query(insertOrder, [orderDate, orderRef, customerId])
                    .then(() => res.send("Order created"))
                    .catch(error => console.error("Something is wrong when adding new order" + error))
            } else {
                res.status(400).send("Customer id " + customerId + " does not exist")
            }
        })
        .catch(error => console.error("Something is wrong " + error))
})
//Add a new PUT endpoint /customers/:customerId to update an existing customer (name, address, city and country)
app.put("/customers/:customerId",(req,res)=>{
    const customerId =req.params.customerId;
    const customerName =req.body.name;
    const customerAddress =req.body.address;
    const customerCity =req.body.city;
    const customerCountry =req.body.country;
    updateCustomer= "UPDATE customers  SET name =$1,address =$2,city=$3, country=$4  where id =$5"
    pool
    .query(updateCustomer,[customerName,customerAddress,customerCity,customerCountry,customerId])
    .then(()=>res.send(`Customer ${customerId} updated!`))
    .catch((e) => console.error(e));

});
//Add a new DELETE endpoint /orders/:orderId to delete an existing order along all the associated order items.
app.delete('/orders/:orderId', (req,res)=>{
    const orderId = req.params.orderId;
    pool.query('delete from order_items where order_id=$1',[orderId])
    .then(()=>{
        pool.query('delete from orders where id =$1',[orderId])
        .then(()=>res.send(`orserid ${orderId} deleted!`))
        .catch((e) => console.error(e));
    })
    .catch((e) => console.error(e));
})
//Add a new DELETE endpoint /customers/:customerId to delete an existing customer only if this customer doesn't have orders
app.delete("/customers/:customerId", function (req, res) {
    const customerId = req.params.customerId;
  
    pool
      .query("DELETE FROM customers WHERE id=$1", [customerId])
      .then(() => res.send(`Customer ${customerId} deleted!`))
      .catch((e) => console.error(e));
  });



 // Add a new GET endpoint /customers/:customerId/orders to load all the orders along the items in the orders of a specific customer.
 // Especially, the following information should be returned: order references, order dates, product names, unit prices, suppliers and quantities.
 app.get("/customers/:customerId/orders", (req, res) => {
    let customerId = req.params.customerId;
    const getCustomerOrders = "select o.order_reference, o.order_date, p.product_name, p.unit_price, s.supplier_name " +
        "from orders o join order_items oi on o.id = oi.order_id " +
        "join products p on p.id = oi.product_id " +
        "join suppliers s on p.supplier_id = s.id " +
        "where o.customer_id = $1"
        pool. query(getCustomerOrders,[customerId])
        .then(result => res.json(result.rows))
        .catch(error => console.error("Something is wrong " + error))
});



app.listen(port, function(){
    console.log('server is listening on 30001 ')
});