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

app.get("/customers", function (req, res) {
    pool.query('SELECT * FROM customers')
        .then(result => res.json(result.rows))
        .catch(error => res.status(400).send({ error: "something went wrong" }))
});

app.get("/suppliers", function (req, res) {
    pool.query('SELECT * FROM suppliers', (error, result) => {
        res.status(200).json(result.rows)

    });
});

//- Update the previous GET endpoint `/products` to filter the list of products by name using a query parameter, 
//for example `/products?name=Cup`. This endpoint should still work even if you don't use the `name` query parameter!
app.get("/products", (req, res) => {
    const productName = req.query.product_name;

    const query = 'select * from products where product_name = $1';
    pool
        .query(query, [productName])
        .then(result => res.status(200).json(result.rows))
        .catch(error => res.status(400).send(error))
})

// (STRETCH GOAL) Add a new GET endpoint /products to load all the product names along with their supplier names.
app.get("/products&suppliers", (req, res) => {
    const query = 'select product_name, supplier_name from products join suppliers on suppliers.id=products.supplier_id order by supplier_name';
    pool.query(query, (error, result) => {
        res.json(result.rows)
    })
})

//Add a new GET endpoint `/customers/:customerId` to load a single customer by ID.
app.get("/customers/:customerId", (req, res) => {
    const customerId = req.params.customerId;
    const query = "select * from customers where id = $1";
    pool
        .query(query, [customerId])
        .then(result => res.status(200).json(result.rows))
        .catch(() => res.status(400).send({ error: "your petition can't be completed" }))
})

//Add a new GET endpoint `/customers/:customerId/orders` to load all the orders along the items 
//in the orders of a specific customer. Especially, the following information should be returned: 
//order references, order dates, product names, unit prices, suppliers and quantities.
app.get("/customers/:customerId/orders", (req, res) => {
    const customerId = req.params.customerId;
    const query =
        `select s.supplier_name as "supplier", p.product_name as "prodcut name", p.unit_price as "price", oi.quantity, o.order_reference as "order reference", o.order_date as "order date" from customers c join orders as o on o.customer_id = c.id join order_items as oi on oi.order_id = o.id join products as p on p.id = oi.product_id join suppliers as s on s.id = p.supplier_id where c.id=${customerId}`
    pool.query(query)
        .then((result) => res.status(200).send(result.rows))
        .catch((error) => {console.log(error); res.status(400).send({ error: "something went wrong" })})
})

//- Add a new POST endpoint `/customers` to create a new customer.
app.post("/customers", (req, res) => {
    console.log("req.body", req.body)
    const newName = req.body.name;
    const newAddress = req.body.address;
    const newCity = req.body.city;
    const newCountry = req.body.country;
    const query = "insert into customers (name, address, city, country) values ($1, $2, $3, $4)";
    if (typeof newName !== "string" || typeof newAddress !== "string" || typeof newCity !== "string" || typeof newCountry !== "string") {
        return res
            .status(400)
            .send("what you wrote it isn't correct!")
    }
    pool
        .query(query, [newName, newAddress, newCity, newCountry])
        .then(result => res.status(201).send("customer finally added!"))
        .catch(e => { res.status(400).send({ error: "the customer wasn't added" }), console.error(e) })
})

//Add a new POST endpoint `/products` to create a new product (with a product name, a price and a supplier id). 
//Check that the price is a positive integer and that the supplier ID exists in the database, otherwise return an error.
app.post("/products", async (req, res) => {
    // console.log(req);
    const newProduct = req.body.product_name;
    const newProPrice = req.body.unit_price;
    const supplierId = req.body.supplier_id;

    const supplierIdExist = await pool.query("select count(*) from products where supplier_id = $1", [supplierId])
        .then((result) => Math.floor(result.rows[0].count))
    //  .catch(error => res.status(500).send(error))
    console.log('supplierIdExist', supplierIdExist);
    if (supplierIdExist < 1) {
        return res
            .status(400)
            .send("the supplier does not exist")
    } else if (!Number.isInteger(newProPrice)) {
        return res
            .status(400)
            .send({ error: "The price is not valid" })
    }
    const query = "insert into products (product_name, unit_price, supplier_id) values ($1, $2, $3)";
    pool.query(query, [newProduct, newProPrice, supplierId])
        .then(() => res.status(201).send("Product succesfully added"))
        .catch((e) => res.status(400).send({ error: "the product couldn't be added" }));
})

//Add a new POST endpoint `/customers/:customerId/orders` to create a new order 
//(including an order date, and an order reference) for a customer. 
//Check that the customerId corresponds to an existing customer or return an error.

app.post("/customers/:customerId/orders", async (req, res) => {
    const customerParamsId = req.params.customerId;
    const newOrderDate = req.body.order_date
    const newOrderReference = req.body.order_reference
    const customerId = req.body.customer_id
    console.log("cust params id > ", parseInt(customerParamsId));
    console.log("cust body id > ", customerId);

    try {
        const customerExist = await pool.query("select * from orders where customer_id = $1", [customerParamsId])
        console.log("customerExist.rowCount>>> ", customerExist.rowCount);
        if (customerExist.rowCount === 0) {
            return res
                .status(400)
                .send({ error: "the customer does not exist" })
        }
    } catch (error) {
        console.error(error);
        res.status(400).send({ error: "something went wrong" })
    }
    const query = "insert into orders (order_date, order_reference) values ($1, $2)";
    pool.query(query, [newOrderDate, newOrderReference])
        .then(() => res.status(201).json("Your order was submitted"))
        .catch(() => res.status(400).send({ error: "the order wasn't submitted" }))
})

//Add a new PUT endpoint `/customers/:customerId` to update an existing customer (name, address, city and country).
app.put("/customers/:customerId", (req, res) => {
    const customerId = req.params.customerId;
    const changeName = req.body.name;
    const changeAddress = req.body.address;
    const changeCity = req.body.city;
    const changeCountry = req.body.country;

    pool
        .query("UPDATE customers SET name=$1, address=$2, city=$3, country=$4 WHERE id=$5",
            [changeName, changeAddress, changeCity, changeCountry, customerId])
        .then(() => res.send(`Customer ${customerId} updated!`))
        .catch(() => res.status(400).send({ error: "the customer couldn't be changed" }));
})


//Add a new DELETE endpoint `/orders/:orderId` to delete an existing order along all the associated order items.
app.delete("/orders/:orderId", (req, res) => {
    const orderId = req.params.orderId;

    pool
        .query("delete from order_items where order_id=$1", [orderId])
        .then(() => {
            pool.query("delete from orders where id=$1", [orderId])
                .then(() => res.send(`order ${orderId} was deleted`))
                .catch(() => res.status(400).send({ error: "the order wasn't deleted" }))
        })
})

//- Add a new DELETE endpoint `/customers/:customerId` to delete an existing customer only if this customer doesn't have orders.
app.delete("/customers/:customerId", async (req, res) => {
    const customerId = req.params.customerId;
    const query = "delete from customers where id=$1";
    console.log(req);
    console.log(parseInt(customerId));
    const customerExist = await pool.query("select count(*) from customers where id = $1", [customerId])
        .then((result) => Math.floor(result.rows[0].count))
    //  .catch(error => res.status(500).send(error))
    console.log('customerExist', customerExist);
    if (customerExist < 1) {
        return res
            .status(400)
            .send("the customer does not exist")
    } else {
        pool
            .query(query, [customerId])
            .then(() => res.send("customer " + customerId + " was deleted"))
            .catch(() => {
                res.status(400).send({ error: `you can't delete customer ${customerId}` })
            })
    }
})


app.listen(3000, function () {
    console.log("Server is listening on port 3000. Ready to accept requests!");
});