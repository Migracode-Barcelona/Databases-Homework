/**
 * 
API ecommerce

-*/

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Pool } = require("pg");
const { response } = require("express");
const app = express();

var corsOptions = {
  origin: "http://localhost:8082",
};

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "cyf_ecommerce",
  password: "postgres",
  port: 5432,
});

app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

function validateEmptyString(myString) {
  if (typeof str === "string" && str.length === 0) {
    return true;
  } else {
    return false;
  }
}

async function checkCustomerId(customerId) {
  const query = "select * from customers where id = $1";

  console.log("Buscando customerId..", customerId);

  let rs = true;

  await pool.query(query, [customerId], (error, response) => {
    if (error) {
      console.log("Something went wrong" + error);
      rs = false;
    } else {
      console.log("OK");
    }
  });
  return rs;
}

/**++++++++++++++++++Customers++++++++++++++++++ */

// route to customers
app.get("/customers", (req, res) => {
  pool.query("select * from customers", (error, response) => {
    if (error) {
      console.log("Something went wrong" + error);
    }
    res.json(response.rows);
  });
});

/**
 * Add a new GET endpoint `/customers/:customerId` to load a single customer by ID.

 */

app.get("/customers/:customerId", (req, res) => {
  const query = "select * from customers where id = $1";
  const customerId = req.params.customerId;

  pool.query(query, [customerId], (error, response) => {
    if (error) {
      console.log("Something went wrong" + error);
    }
    res.json(response.rows);
  });
});

/**
 * Add a new POST endpoint `/customers` to create a new customer.
{
    "name": "Guy3 Crawford",
    "address": "770-2839 Ligula Road",
    "city": "Paris",
    "country": "France"
}
 */
app.post("/customers", (req, res) => {
  const query =
    "insert into customers (name,address,city,country) values ($1, $2, $3, $4)";
  const { name, address, city, country } = req.body;

  console.log("name", name);
  pool.query(
    query,
    [name, address, city, country],
    (error, response) => {
      if (error) {
        console.log("Something went wrong" + error);
      }
      res.json("Inserted");
    }
  );
});

/**
 * Add a new PUT endpoint `/customers/:customerId` to update an existing customer (name, address, city and country).
 {
     
     "name": "Guy Updated",
     "address": "770-2839 Ligula Road",
     "city": "Caracas",
     "country": "Venezuela"
    }
    */
app.put("/customers/:customerId", (req, res) => {
  const query =
    "update customers set address = $3, name = $2, city = $4, country = $5 where id = $1 ";
  const customerId = req.params.customerId;
  const { name, address, city, country } = req.body;

  pool.query(
    query,
    [customerId, name, address, city, country],
    (error, response) => {
      if (error) {
        console.log("Something went wrong" + error);
      }
      res.json("Customer " + customerId + " Updated");
    }
  );
});

/**
 * - Add a new DELETE endpoint `/customers/:customerId` to delete an existing customer only if this customer doesn't have orders.

 */
 app.delete("/customers/:customerId", (req, res) => {
    const query =
      "delete from customers where id = $1 ";
    const customerId = req.params.customerId;
    
    pool.query(
      query,
      [customerId],
      (error, response) => {
        if (error) {
          console.log("Something went wrong" + error);
        }
        res.json("Customer " + customerId + " Deleted");
      }
    );
  });

/**+++++++++++++++++++++++++++ORDERS+++++++++++++++++++++++++++ */
/**
 *  Add a new GET endpoint `/customers/:customerId/orders` to load all the orders along the items in the orders of a specific customer. Especially, the following information should be returned: order references, order dates, product names, unit prices, suppliers and quantities.
 
 */
 app.get("/customers/:customerId/orders", (req, res) => {
    const query = "select * from orders where customer_id = $1";
    const customerId = req.params.customerId;
  
    pool.query(query, [customerId], (error, response) => {
      if (error) {
        console.log("Something went wrong" + error);
      }
      res.json(response.rows);
    });
  });

/**
     * Add a new POST endpoint `/customers/:customerId/orders` to create a new order (including an order date, and an order reference) for a customer. Check that the customerId corresponds to an existing customer or return an error.
    
     */
app.post("/customers/:customerId/orders", (req, res) => {
  const query =
    "insert into orders (order_date,order_reference,customer_id) values ($1, $2, $3)";
  const { order_date, order_reference } = req.body;
  const customer = req.params.customerId;

  console.log("req", req.body);
  console.log("name", order_date);
  let check = checkCustomerId(customer);
  console.log(check);
  check.then((value) => {
    console.log(value);

    if (value) {
      pool.query(
        query,
        [order_date, order_reference, customer],
        (error, response) => {
          if (error) {
            console.log("Something went wrong" + error);
            res.json("Error: " + error);
          } else {
            console.log("INSERTED");
          }
          //res.json("Inserted");
        }
      );
    } else {
      res.json("Customer does not exists");
    }
  });
  res.json("Inserted");
});

/**
 * - Add a new DELETE endpoint `/orders/:orderId` to delete an existing order along all the associated order items.

 */

app.delete("/orders/:orderId", (req, res) => {
    const query1 =
    "delete from order_items where order_id = $1 ";
    const query2 = "delete from orders where id = $1 ";
  const orderId = req.params.orderId;
  
    pool.query(query1, [orderId], (error,response) => {
        if (error) {
            console.log("Something went wrong " + error);
            //res.json(error);
        }
        //res.json(Deleted);
        console.log("Deleted");
    })

    pool.query(query2, [orderId], (error,response) => {
        if (error) {
            console.log("Something went wrong " + error);
            res.json(error);
        }
        res.json("Deleted");
    })
})

/**++++++++++++++++++++++++SUPPLIERS+++++++++++++++++++++++++++++ */
// route to suppliers
app.get("/suppliers", (req, res) => {
  pool.query("select * from suppliers", (error, response) => {
    if (error) {
      console.log("Something went wrong" + error);
    }
    res.json(response);
  });
});

/**+++++++++++++++++++++++++PRODUCTS++++++++++++++++++++++++++++ */

// route to products
app.get("/products", (req, res) => {
  /* pool.query('select p.product_name, s.supplier_name  from products p join suppliers s on p.supplier_id = s.id', (error, response) => {
         if (error){
             console.log("Something went wrong" + error);
         }
         res.json(response);
     });*/

  let selectProductQry =
    "select p.product_name, s.supplier_name  from products p join suppliers s on p.supplier_id = s.id";

  console.log("selectProductQry", selectProductQry);

  pool
    .query(selectProductQry)
    .then((response) => res.json(response.rows))
    .catch((error) => console.log("Something went wrong" + error));
});

/**
 * If you don't have it already, add a new GET endpoint `/products` to load all the product names along with their supplier names.

- Update the previous GET endpoint `/products` to filter the list of products by name using a query parameter, for example `/products?name=Cup`. This endpoint should still work even if you don't use the `name` query parameter!
 */
app.get("/products/:name", (req, res) => {
  /* pool.query('select p.product_name, s.supplier_name  from products p join suppliers s on p.supplier_id = s.id', (error, response) => {
        if (error){
            console.log("Something went wrong" + error);
        }
        res.json(response);
    });*/
  const productName = req.params.name;

  let selectProductQry =
    "select p.product_name, s.supplier_name  from products p join suppliers s on p.supplier_id = s.id where p.product_name = $1";

  if (validateEmptyString(productName)) {
    let selectProductQry =
      "select p.product_name, s.supplier_name  from products p join suppliers s on p.supplier_id = s.id";
  }

  console.log("selectProductQry", selectProductQry);

  pool
    .query(selectProductQry, [productName])
    .then((response) => res.json(response.rows))
    .catch((error) => console.log("Something went wrong" + error));
});

/**
 * Add a new POST endpoint `/products` to create a new product (with a product name, a price and a supplier id). Check that the price is a positive integer and that the supplier ID exists in the database, otherwise return an error.

 */
app.post("/products", (req, res) => {
  const postProductQry =
    "insert into products (product_name,unit_price,supplier_id) values ($1, $2, $3)";
  const { name, price, supplier } = req.body;

  console.log("name", name);
  pool.query(postProductQry, [name, price, supplier], (error, response) => {
    if (error) {
      console.log("Something went wrong" + error);
    }
    res.json("Inserted");
  });
});

// set port, listen for requests
const PORT = process.env.PORT || 8082;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
  //console.log(first);
});
