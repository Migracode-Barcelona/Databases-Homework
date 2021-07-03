const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const { Pool } = require("pg");
const secret = require("./secret.json");

const pool = new Pool(secret);

app.use(bodyParser.json());

//GET endpoint /hotels to see all of the hotel info
app.get("/hotels", (req, res) => {
  pool
    .query("SELECT * FROM hotels ORDER BY id")
    .then((result) => res.json(result.rows))
    .catch((e) => console.error(e));
});

//POST to create a new hotel
app.post("/hotels", (req, res) => {
  /* BODY TEXT
  {
        "name": "",
        "rooms": ,
        "postcode": ""
    } */

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
          .send("A hotel with the same name already exists!");
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

//POST to create a new customer
app.post("/customers", (req, res) => {
  // const newCustomer = {
  //   name: req.body.name,
  //   email: req.body.email,
  //   address: req.body.address,
  //   city: req.body.city,
  //   postcode: req.body.postcode,
  //   country: req.body.country,
  // };    Why doesn't this work???

  /* BODY TEXT
{
    "name": "", 
    "email": "",
    "address": "",
    "city": "",
    "postcode": "",
    "country": ""
} */

  const newName = req.body.name;
  const newEmail = req.body.email;
  const newAddress = req.body.address;
  const newCity = req.body.city;
  const newPostcode = req.body.postcode;
  const newCountry = req.body.country;

  pool
    .query("SELECT * FROM customers WHERE name = $1 OR email = $2", [
      newName,
      newEmail,
    ])
    .then((result) => {
      if (result.rows.length > 0) {
        return res
          .status(400)
          .send("A customer with the same name or email already exists!");
      } else {
        pool
          .query(
            "INSERT INTO customers (name, email, address, city, postcode, country) VALUES ($1, $2, $3, $4, $5, $6)",
            [newName, newEmail, newAddress, newCity, newPostcode, newCountry]
          )
          .then(() => res.send("Customer added to database!"))
          .catch((error) => console.error(error));
      }
    });
});

/* EXERCISE 2*/
// Add the GET endpoints /hotels and /hotels/:hotelId mentioned above and try to use these endpoints with Postman.
app.get("/hotelsbyname", (req, res) => {
  pool
    .query("SELECT * FROM hotels ORDER BY name")
    .then((result) => res.json(result.rows))
    .catch((error) => console.error(error));
});

app.get("/hotels/:hotelId", (req, res) => {
  const hotelId = req.params.hotelId;
  pool
    .query("SELECT * FROM hotels WHERE id = $1", [hotelId])
    .then((result) => res.json(result.rows))
    .catch((error) => console.error(error));
});

// Add a new GET endpoint /customers to load all customers ordered by name.
app.get("/customers", (req, res) => {
  pool
    .query("SELECT * FROM customers ORDER BY name")
    .then((result) => res.json(result.rows))
    .catch((e) => console.error(e));
});

// Add a new GET endpoint /customers/:customerId to load one customer by ID.
app.get("/customers/:customerId", (req, res) => {
  const customerId = req.params.customerId;
  pool
    .query("SELECT * FROM customers WHERE id=$1", [customerId])
    .then((result) => {
      if (result.rows.length <= 0) {
        res.status(400).send("Customer doesn't exist!");
      } else {
        res.json(result.rows);
      }
    })
    .catch((error) => console.error(error));
});

// Add a new GET endpoint /customers/:customerId/bookings to load all the bookings of a specific customer. Returns the following information: check in date, number of nights, hotel name, hotel postcode.
app.get("/customers/:customerId/bookings", (req, res) => {
  const customerId = req.params.customerId;
  pool
    .query(
      "SELECT b.checkin_date, b.nights, h.name, h.postcode FROM customers c INNER JOIN bookings b ON c.id = b.customer_id INNER JOIN hotels h ON h.id = b.hotel_id WHERE c.id=$1",
      [customerId]
    )
    .then((result) => {
      if (result.rows.length <= 0) {
        res.status(400).send("No bookings found for this customer!");
      } else {
        res.json(result.rows);
      }
    })
    .catch((error) => console.error(error));
});

/* EXERCISE 3 */
//Add the PATCH endpoint /customers/:customerId and verify you can update a customer email using Postman.
// app.patch("/customers/:customerId", (req, res) => {
//   const customerId = req.params.customerId;
//   const newEmail = req.body.email;

//   pool
//     .query("UPDATE customers c SET email=$1 WHERE id=$2", [
//       newEmail,
//       customerId,
//     ])
//     .then(() => res.send(`Customer ${customerId} updated!`))
//     .catch((e) => console.error(e));
// });

// Add validation for the email before updating the customer record in the database. If the email is empty, return an error message.
// app.patch("/customers/:customerId", (req, res) => {
//   const customerId = req.params.customerId;
//   const newEmail = req.body.email;

//   if (newEmail == "") {
//     res.status(400).send("Please enter a valid email!");
//   }

//   pool
//     .query("UPDATE customers SET email=$1 WHERE id=$2", [newEmail, customerId])
//     .then(() => res.send(`Customer ${customerId} updated!`))
//     .catch((e) => console.error(e));
// });

// Add the possibility to also update the address, the city, the postcode and the country of a customer. Be aware that if you want to update the city only for example, the other fields should not be changed!
app.patch("/customers/:customerId", (req, res) => {
  const customerId = req.params.customerId;
  const newEmail = req.body.email;
  const newAddress = req.body.address;
  const newCity = req.body.city;
  const newPostcode = req.body.postcode;
  const newCountry = req.body.country;

  if (newEmail == "") {
    res.status(400).send("Please enter a valid email!");
  }

  if (newEmail) {
    pool
      .query("UPDATE customers SET email=$1 WHERE id=$2", [
        newEmail,
        customerId,
      ])
      .then(() => res.send(`Customer ${customerId} updated!`))
      .catch((e) => console.error(e));
  }

  if (newAddress) {
    pool
      .query("UPDATE customers c SET address=$1 WHERE id=$2", [
        newAddress,
        customerId,
      ])
      .then(() => res.send(`Customer ${customerId} updated!`))
      .catch((e) => console.error(e));
  }
  if (newCity) {
    pool
      .query("UPDATE customers SET city=$1 WHERE id=$2", [newCity, customerId])
      .then(() => res.send(`Customer ${customerId} updated!`))
      .catch((e) => console.error(e));
  }
  if (newPostcode) {
    pool
      .query("UPDATE customers SET postcode=$1 WHERE id=$2", [
        newPostcode,
        customerId,
      ])
      .then(() => res.send(`Customer ${customerId} updated!`))
      .catch((e) => console.error(e));
  }
  if (newCountry) {
    pool
      .query("UPDATE customers SET country=$1 WHERE id=$2", [
        newCountry,
        customerId,
      ])
      .then(() => res.send(`Customer ${customerId} updated!`))
      .catch((e) => console.error(e));
  }
});

//EXERCISE 4 - DELETE
// Add the DELETE endpoint /customers/:customerId above and verify you can delete a customer along their bookings with Postman.
app.delete("/customers/:customerId", (req, res) => {
  const customerId = req.params.customerId;

  pool
    .query("DELETE FROM bookings WHERE customer_id=$1", [customerId])
    .then(() => {
      pool
        .query("DELETE FROM customers where id=$1", [customerId])
        .then(() => res.send(`Customer ${customerId} deleted!`))
        .catch((error) => console.error(error));
    });
});

// Add a new DELETE endpoint /hotels/:hotelId to delete a specific hotel. A hotel can only be deleted if it doesn't appear in any of the customers' bookings! Make sure you add the corresponding validation before you try to delete a hotel.
app.delete("/hotels/:hotelId", (req, res) => {
  const hotelId = req.params.hotelId;

  pool.query(
    "SELECT * FROM bookings b INNER JOIN hotels h on b.hotel_id = h.id "
  );
  pool
    .query("DELETE FROM bookings WHERE hotel_id=$1", [hotelId])
    .then(() => {
      pool
        .query("DELETE FROM hotels WHERE id=$1", [hotelId])
        .then(() => res.send(`Hotel ${hotelId} deleted!`))
        .catch((error) => console.error(error));
    })
    .catch((error) => console.error(error));
});

//GET default endpoint to confirm which project we are working with
app.get("/", (req, res) => {
  res.send("cyf-hotels-api");
});

app.listen(3000, () => console.log("Server is up and running"));
