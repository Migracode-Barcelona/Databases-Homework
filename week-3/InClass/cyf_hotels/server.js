const express = require("express");
const app = express();
const { Pool } = require("pg");
const bodyParser = require("body-parser");
app.use(bodyParser.json());
const secret = require("./secret.json");

const pool = new Pool(secret);

//Reading data
app.get("/hotels", function (req, res) {
  pool
    .query("SELECT * FROM hotels")
    .then((result) => res.json(result.rows))
    .catch((e) => console.error(e));
});

//Exercise 1 - POST method
app.post("/hotels", function (req, res) {
  const newHotelName = req.body.name;
  const newHotelRooms = req.body.rooms;
  const newHotelPostcode = req.body.postcode;

  if (!Number.isInteger(newHotelRooms) || newHotelRooms <= 0) {
    return res
      .status(400)
      .send("The number of rooms should be a positive integer.");
  }

  pool
    .query("SELECT * FROM hotels WHERE name=$1", [newHotelName])
    .then((result) => {
      if (result.rows.length > 0) {
        return res
          .status(400)
          .send("An hotel with the same name already exists!");
      } else {
        const query =
          "INSERT INTO hotels (name, rooms, postcode) VALUES ($1, $2, $3)";
        pool
          .query(query, [newHotelName, newHotelRooms, newHotelPostcode])
          .then(() => res.send("Hotel created!"))
          .catch((e) => console.error(e));
      }
    });
});

//2. Get all information from customers
app.get("/customers", function (req, res) {
  pool
    .query("SELECT * FROM customers")
    .then((result) => res.json(result.rows))
    .catch((e) => console.error(e));
});

//Update all the customers in the customers table - PUT method - is for the whole row
app.put("/customers/:customerId", function (req, res) {
  const customerId = req.params.customerId;
  const newEmail = req.body.email;
  console.log(newEmail);

  pool
    .query("UPDATE customers SET email=$1 WHERE id=$2", [newEmail, customerId])
    .then(() => res.send(`Customer ${customerId} has been updated!`))
    .catch((e) => console.error(e));
});

//Extra exercise - retrieving the last id of the hotels table
app.post("/newHotels", function (req, res) {
  const newHotelName = req.body.name;
  const newHotelRooms = req.body.rooms;
  const newHotelPostcode = req.body.postcode;

  if (!Number.isInteger(newHotelRooms) || newHotelRooms <= 0) {
    return res
      .status(400)
      .send("The number of rooms should be a positive integer.");
  }

  pool
    .query("SELECT * FROM hotels WHERE name=$1", [newHotelName])
    .then((result) => {
      if (result.rows.length > 0) {
        return res
          .status(400)
          .send("An hotel with the same name already exists!");
      } else {
        const query =
          "INSERT INTO hotels (name, rooms, postcode) VALUES ($1, $2, $3) returning id as hotelId";
        pool
          .query(query, [newHotelName, newHotelRooms, newHotelPostcode])
          .then((secondResult) => res.json(secondResult.rows[0]))
          .catch((e) => console.error(e));
      }
    });
});

//Exercise 2
app.get("/hotels", function (req, res) {
  pool
    .query("SELECT * FROM hotels")
    .then((result) => res.json(result.rows))
    .catch((e) => console.error(e));
});

//1. Add the GET endpoints /hotels and /hotels/:hotelId mentioned above and try to use these endpoints with Postman.
app.get("/hotels/:hotelId", function (req, res) {
  const hotelId = req.params.body;
  pool
    .query("SELECT * FROM hotels where id=$1", [hotelId])
    .then((result) => res.json(result.rows[0]))
    .catch((e) => console.error(e));
});

//2. Add a new GET endpoint /customers to load all customers ordered by name
app.get("/customers", function (req, res) {
  pool
    .query("SELECT * customers c ORDER BY c.name")
    .then((result) => res.json(result.rows))
    .catch((e) => res.status(500).send("Something went wrong"));
});

//3. Add a new GET endpoint /customers/:customerId to load one customer by ID
app.get("/customers/:customerId", function (req, res) {
  const customerId = req.params.customerId;

  pool
    .query("SELECT * FROM customers c WHERE c.id= $1", [customerId])
    .then((result) => res.json(result.rows))
    .catch((e) => res.status(500).send("Something went wrong"));
});

//4. Add a new GET endpoint /customers/:customerId/bookings to load all the bookings of a specific customer
// Returns the following information: check in date, number of nights, hotel name, hotel postcode
app.get("/customers/:customerId/bookings", function (req, res) {
  const customerId = req.params.customerId;

  pool
    .query(
      `SELECT checkin_date, nights, hotels.name, hotels.postcode
 FROM bookings
 JOIN hotels ON bookings.hotel_id = hotels.id
WHERE customer_id= $1`,
      [customerId]
    )
    .then((result) => res.json(result.rows))
    .catch((e) => res.status(500).send("Something went wrong"));
});

//EXTRA exercise
//Add one endpoint that gives you the hotel name based on the id
app.get("/hotels/:hotelId", function (req, res) {
  const hotelId = req.params.hotelId;

  pool
    .query("SELECT * FROM hotels WHERE id= $1", [hotelId])
    .then((result) => res.json(result.rows[0]))
    .catch((e) => console.error(e));
});

//EXTRA exercise
// Add one endpoint that gives you the id based on the name
app.get("/hotels/:hotelName", function (req, res) {
  const hotelName = req.params.hotelName;

  if (hotelName) {
    query = `SELECT * FROM hotels WHERE name LIKE '${hotelName}' ORDER BY name`;
  }

  pool
    .query("SELECT * FROM hotels WHERE id= $1", [hotelId])
    .then((result) =>
      hotelName ? res.json(result.rows[0]) : res.json(result.rows)
    )
    .catch((e) => console.error(e));
});

//Add a new GET endpoint /customers to load all customers ordered by name
app.get("/customers", function (req, res) {
  const customerName = req.params.name;
  let query = "SELECT * FROM customers ORDER BY c.name";

  if (customerName) {
    query = `SELECT * FROM hotels WHERE name LIKE '${customerName}' ORDER BY c.name`;
  }

  pool
    .query("SELECT * FROM customers WHERE id= $1", [customerId])
    .then((result) =>
      customerName ? res.json(result.rows[0]) : res.json(result.rows)
    )
    .catch((e) => console.error(e));
});

//Exercise 3 - PATCH method - only for specific columns/specific properties
app.get("/customers/:customerId", function (req, res) {
  const customerId = req.params.customerId;
  pool
    .query("SELECT * FROM customers WHERE id = $1", [customerId])
    .then((result) => res.json(result.rows))
    .catch((e) => console.error(e));
});

//1. Add the PATCH endpoint /customers/:customerId and verify you can update a customer email using Postman
app.patch("/customers/:customerId", function (req, res) {
  const customerId = req.params.customerId;
  const newEmail = req.body.email;
  //2. Add the possibility to also update the address, the city, the postcode and the country of a customer. Be aware that if you want to
  //update the city only for example, the other fields should not be changed!
  const newAddress = req.body.address;
  const newCity = req.body.city;
  const newPostcode = req.body.postcode;
  const newCountry = req.body.country;

  return pool
    .query("SELECT * FROM customers WHERE id=$1", [customerId])
    .then((result) => {
      const customers = result.rows;
      const customer = customers[0];
      res.json(customer);

      //3. Add validation for the email before updating the customer record in the database. If the email is empty, return an error message
      if (newEmail !== "" && newEmail !== undefined) {
        customer.email = newEmail;
      }

      if (newAddress !== "" && newAddress !== undefined) {
        customer.address = newAddress;
      }

      if (newCity !== "" && newCity !== undefined) {
        customer.city = newCity;
      }

      if (newPostcode !== "" && newPostcode !== undefined) {
        customer.postcode = newPostcode;
      }

      if (newCountry !== "" && newCountry !== undefined) {
        customer.country = newCountry;
      }

      pool
        .query(
          `
    UPDATE customers 
    SET email=$1, address=$2,city=$3, postcode=$4, country=$5
    WHERE id=$6
    `,
          [
            customer.email,
            customer.address,
            customer.city,
            customer.postcode,
            customer.country,
            customer.id,
          ]
        )
        .then(() => res.send(`Customer ${customerId} has been updated`))
        .catch((e) => {
          console.error(e.stack);
          res.status(500).send("Something went wrong");
        });
    });
});

//Exercise 4 -DELETE method
//Extra exercise - /bookings/:bookingsId
app.get("/bookings/:bookingsId", function (req, res) {
  const bookingsId = req.params.bookingsId;
  pool
    .query("SELECT * FROM bookings b WHERE b.id=$1 returning b.id", [
      bookingsId,
    ])
    .then((result) => res.json(result.rows))
    .catch((e) => console.error(e));
});

app.delete("/bookings/:bookingsId", function (req, res) {
  const bookingsId = req.params.bookingsId;

  pool
    .query("DELETE FROM bookings b WHERE b.id=$1 returning b.id", [bookingsId])
    .then((result) => res.json(result.rows[0]))
    .catch((e) => console.error(e));
});

//1. Add the DELETE endpoint /customers/:customerId above and verify you can delete a customer along their bookings with Postman
app.delete("/customers/:customerId", function (req, res) {
  const customerId = req.params.customerId;
  pool
    .query("DELETE FROM bookings b WHERE customer_id=$1", [customerId])
    .then(() =>
      res.send(`Customer ${customerId} and the bookings have been deleted`)
    )
    .catch((e) => console.error(e));
});


//2. Add a new DELETE endpoint /hotels/:hotelId to delete a specific hotel. A hotel can only be deleted if it doesn't appear in any of the customers' bookings!
app.delete("/hotels/:hotelId", function (req, res) {
  const hotelId = req.params.hotelId;
  pool
    .query("SELECT * FROM bookings WHERE hotel_id=$1", [hotelId])
    .then((result) => {
      // Make sure you add the corresponding validation before you try to delete a hotel
      if (result.rows.length > 0) {
        return res.status(400).send("This hotel has bookings available");
      }
      pool
        .query("DELETE FROM hotels WHERE hotel_id=$1 ", [hotelId])
        .then(() => res.send(`Customer ${hotelId} has been deleted`))
        .catch((e) => console.error(e));
    })
    .catch((e) => console.error(e));
});

app.listen(3000, function () {
  console.log("Server is listening on port 3000. Ready to accept requests!");
});
