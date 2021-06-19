DROP TABLE IF EXISTS bank_details;
DROP TABLE IF EXISTS rooms;
DROP TABLE IF EXISTS customers;
DROP TABLE IF EXISTS hotels;
DROP TABLE IF EXISTS bookings;


CREATE TABLE customers (
  id        SERIAL PRIMARY KEY,
  name      VARCHAR(30) NOT NULL,
  email     VARCHAR(120) NOT NULL,
  address   VARCHAR(120),
  city      VARCHAR(30),
  postcode  VARCHAR(12),
  country   VARCHAR(20)
);


select * from customers;
SELECT name,address FROM customers WHERE id = 1;


create table bank_details (
id     SERIAL primary key,
customer_id INT references customers(id),
bank_name VARCHAR(30),
iban_code VARCHAR(20) not null 
);


create table hotels (
id    SERIAL primary key,
name  VARCHAR(30) not NULL,
street VARCHAR(30) not null,
country VARCHAR(30) not null,
postcode VARCHAR(12) not null,
city VARCHAR(20) not null,
number_of_rooms INT not null
);


select * from hotels;


create table rooms (
id   SERIAL primary key,
hotel_id INT references hotels(id),
is_available boolean not null,
price_per_night INT not null
);


 CREATE TABLE bank_details (
  id        SERIAL PRIMARY KEY,
  customer_id INT REFERENCES customers(id),
  bank_name  VARCHAR(30) NOT null,
  iban_code  VARCHAR(30) NOT null
);


CREATE TABLE bookings (
  id               SERIAL PRIMARY KEY,
  customer_id      INT REFERENCES customers(id),
  hotel_id         INT REFERENCES hotels(id),
  checkin_date     DATE NOT NULL,
  nights           INT NOT NULL
);

select * from bookings;

---inserting customers---
INSERT INTO customers (name, email, address, city, postcode, country) VALUES ('John Smith','j.smith@johnsmith.org','11 New Road','Liverpool','L10 2AB','UK');
INSERT into customers (name, email, address, city, postcode, country) values ('Enia Munteanu', 'mooniae@gmail.com', '3 Liberty Street', 'Paradise City', 'G10 3BG', 'United States');
INSERT into customers (name, email, address, city, postcode, country) values ('Marilyn Monroe', 'diamonds_are_a_girls_bf@gmail.com', 'Sunset Blvd', 'Atlanta', 'K11 3RI', 'United States');
INSERT into customers (name, email, address, city, postcode, country) values ('Vladimir Nabokov', 'lolita@gmail.com', 'Books Street', 'Kiev', 'K34 3UI', 'Russia');
INSERT into customers (name, email, address, city, postcode, country) values ('Laurence Lebihan', 'laurence_of_arabia@gmail.com', 'Filmset', 'Destino', 'L34 4JU', 'UK');
INSERT into customers (name, email, address, city, postcode, country) values ('Melinda Marsh', 'melinda_melinda@gmail.com', 'Apple Street', 'Manchester', 'L39 6GN', 'UK');
INSERT INTO customers (name, email, address, city, postcode, country) VALUES ('John Smith','j.smith@johnsmith.org','11 New Road','Liverpool','L10 2AB','UK');
INSERT INTO customers (name, email, address, city, postcode, country) VALUES ('Sue Jones','s.jones1234@gmail.com','120 Old Street','London','N10 3CD','UK');
INSERT INTO customers (name, email, address, city, postcode, country) VALUES ('Alice Evans','alice.evans001@hotmail.com','3 High Road','Manchester','m13 4ef','UK');
INSERT INTO customers (name, email, address, city, postcode, country) VALUES ('Mohammed Trungpa','mo.trungpa@hotmail.com','25 Blue Road','Manchester','M25 6GH','UK');
INSERT INTO customers (name, email, address, city, postcode, country) VALUES ('Steven King','steve.king123@hotmail.com','19 Bed Street','Newtown', 'xy2 3ac','UK');
INSERT INTO customers (name, email, address, city, postcode, country) VALUES ('Nadia Sethuraman','nadia.sethuraman@mail.com','135 Green Street','Manchester','M10 4BG','UK');
INSERT INTO customers (name, email, address, city, postcode, country) VALUES ('MartÃ­n Sommer','martin.sommer@dfgg.net','C/ Romero, 33','Madrid','28016','Spain');
INSERT INTO customers (name, email, address, city, postcode, country) VALUES ('Keith Stewart','keith.stewart@gmail.com','84 Town Lane','Tadworth','td5 7ng','UK');

---select all information from customer Laurence Lebihan---
SELECT * FROM customers where name = 'Laurence Lebihan';
---retrieve all customers living in UK---
SELECT * FROM customers WHERE country = 'UK';
---retrieve the address, city and postcode of Melinda Marsh---
SELECT address,city,postcode FROM customers WHERE name = 'Melinda Marsh';

---inserting hotels---
INSERT INTO hotels (name, street,country, postcode, city, number_of_rooms) VALUES ('Triple Point Hotel', 'Pelai','Romania', 'CM194JS','Cluj', '20');
INSERT INTO hotels (name, street,country, postcode, city, number_of_rooms) VALUES ('Royal Cosmos Hotel', 'Mara','Spain', 'TR209AX','Girona', '5');
INSERT INTO hotels (name, street,country, postcode, city, number_of_rooms) VALUES ('Pacific Petal Motel', 'Besos','Spain', 'BN180TG','Barcelona', '15');
INSERT INTO hotels (name, street,country, postcode, city, number_of_rooms) VALUES ('Petonets Hotel', 'Servet','Spain', 'LU150TG','Barcelona', '10');
INSERT INTO hotels (name, street,country, postcode, city, number_of_rooms) VALUES ('Vladimir Hotel', 'Mantuleasa','Romania', 'DGQ127','Brasov', '7');
INSERT INTO hotels (name, street,country, postcode, city, number_of_rooms) VALUES ('Nabucco Hotel', ' Via Opera','Italy', 'PO130YN','Milano', '3');
INSERT INTO hotels (name, rooms, postcode) VALUES ('Golden Cavern Resort', 10, 'L10ABC');
INSERT INTO hotels (name, rooms, postcode) VALUES ('Elder Lake Hotel', 5, 'L10ABC');
INSERT INTO hotels (name, rooms, postcode) VALUES ('Pleasant Mountain Hotel', 7, 'ABCDE1');
INSERT INTO hotels (name, rooms, postcode) VALUES ('Azure Crown Resort & Spa', 18, 'DGQ127');
INSERT INTO hotels (name, rooms, postcode) VALUES ('Jade Peaks Hotel', 4, 'DGQ127');
INSERT INTO hotels (name, rooms, postcode) VALUES ('Elegant Resort', 14, 'DGQ127');
INSERT INTO hotels (name, rooms, postcode) VALUES ('Cozy Hotel', 20, 'AYD189');
INSERT INTO hotels (name, rooms, postcode) VALUES ('Snowy Echo Motel', 15, 'AYD189');

SELECT * FROM hotels WHERE postcode = 'CM194JS' OR postcode = 'TR209AX';
---retrieve all hotels located in the postcode DGQ127---
SELECT * FROM hotels WHERE postcode = 'DGQ127';
---retrieve all hotels with more than 11 rooms---
SELECT * FROM hotels WHERE number_of_rooms > 11;
---retrieve all hotels with more than 6 rooms but less than 15 rooms---
SELECT * FROM hotels WHERE number_of_rooms > 6 AND number_of_rooms < 15;
---retrieve all hotels with exactly 10 rooms or 20 rooms---
SELECT * FROM hotels WHERE number_of_rooms = 10 OR number_of_rooms = 20;

---inserting bookings---
INSERT INTO bookings (customer_id, hotel_id, checkin_date, nights) VALUES (1, 1, '2019-10-01', 2);
INSERT INTO bookings (customer_id, hotel_id, checkin_date, nights) VALUES (1, 3, '2021-07-01', 4);
INSERT INTO bookings (customer_id, hotel_id, checkin_date, nights) VALUES (1, 5, '2021-08-15', 9);
INSERT INTO bookings (customer_id, hotel_id, checkin_date, nights) VALUES (1, 4, '2021-08-24', 2);
INSERT INTO bookings (customer_id, hotel_id, checkin_date, nights) VALUES (1, 6, '2021-06-24', 1);
INSERT INTO bookings (customer_id, hotel_id, checkin_date, nights) VALUES (1, 2, '2020-06-24', 1);
INSERT INTO bookings (customer_id, hotel_id, checkin_date, nights) VALUES (1, 1, '2019-10-01', 2);
INSERT INTO bookings (customer_id, hotel_id, checkin_date, nights) VALUES (1, 1, '2019-12-10', 6);
INSERT INTO bookings (customer_id, hotel_id, checkin_date, nights) VALUES (1, 3, '2019-07-20', 4);
INSERT INTO bookings (customer_id, hotel_id, checkin_date, nights) VALUES (2, 3, '2020-03-10', 4);
INSERT INTO bookings (customer_id, hotel_id, checkin_date, nights) VALUES (2, 5, '2020-04-01', 1);
INSERT INTO bookings (customer_id, hotel_id, checkin_date, nights) VALUES (3, 1, '2019-11-01', 1);
INSERT INTO bookings (customer_id, hotel_id, checkin_date, nights) VALUES (3, 2, '2019-11-23', 2);
INSERT INTO bookings (customer_id, hotel_id, checkin_date, nights) VALUES (4, 8, '2019-12-23', 3);
INSERT INTO bookings (customer_id, hotel_id, checkin_date, nights) VALUES (4, 2, '2019-09-16', 5);
INSERT INTO bookings (customer_id, hotel_id, checkin_date, nights) VALUES (6, 5, '2019-09-14', 2);
INSERT INTO bookings (customer_id, hotel_id, checkin_date, nights) VALUES (6, 6, '2020-01-14', 5);
INSERT INTO bookings (customer_id, hotel_id, checkin_date, nights) VALUES (8, 4, '2020-02-01', 3);
INSERT INTO bookings (customer_id, hotel_id, checkin_date, nights) VALUES (8, 5, '2020-01-03', 7);
INSERT INTO bookings (customer_id, hotel_id, checkin_date, nights) VALUES (8, 8, '2019-12-25', 4);


SELECT * FROM bookings WHERE checkin_date > '2019/10/01';
---retrieve all the bookings starting after 2019/10/01 and longer than 2 nights---
SELECT * FROM bookings WHERE checkin_date > '2019/10/01' AND nights >= 2;
---retrieve all bookings for customer id 1---
SELECT * FROM bookings WHERE customer_id = 1;
---retrieve bookings for more than 4 nights---
SELECT * FROM bookings WHERE nights > 4;
SELECT * FROM bookings WHERE checkin_date = '2020-06-24';
