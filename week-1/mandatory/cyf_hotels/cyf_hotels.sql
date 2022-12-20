DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS bank_details;
DROP TABLE IF EXISTS rooms;
DROP TABLE IF EXISTS customers;
DROP TABLE IF EXISTS hotels;
CREATE TABLE customers (
  id        SERIAL PRIMARY KEY,
  name      VARCHAR(30) NOT NULL,
  email     VARCHAR(120) NOT NULL,
  address   VARCHAR(120),
  city      VARCHAR(30),
  postcode  VARCHAR(12),
  country   VARCHAR(20)
);
CREATE TABLE hotels (
  id        SERIAL PRIMARY KEY,
  name      VARCHAR(30) NOT NULL,
  rooms		INT not null,
  postcode	VARCHAR (10)
);

CREATE TABLE bookings (
  id               SERIAL PRIMARY KEY,
  customer_id      INT REFERENCES customers(id),
  hotel_id         INT REFERENCES hotels(id),
  checkin_date     DATE NOT NULL,
  nights           INT NOT NULL
);

CREATE TABLE rooms (
  id        SERIAL PRIMARY KEY,
  hotel_id INT REFERENCES hotels(id),
  is_available boolean NOT null,
  price_per_night INT NOT NULL
);
CREATE TABLE bank_details (
  id SERIAL PRIMARY KEY,
  customer_id INT REFERENCES customers(id),
  bank_name  VARCHAR(30) NOT null,
  iban_code  VARCHAR(30) NOT null
);

--- insert into <table-name> (<columns that we want to fill>) values (<values that we insert>)
insert into customers (name, email, address, city, postcode, country) values ('Kimberly Krieg', 'sigamigabarcelona@gmail.com', 'Carrer dels Cecs del a Boqueria 2', 'Barcelona', '08002', 'Spain');
select * from customers;

INSERT INTO customers (name, email, address, city, postcode, country) VALUES ('John Smith','j.smith@johnsmith.org','11 New Road','Liverpool','L10 2AB','UK');
INSERT INTO hotels (name, rooms, postcode) VALUES ('Triple Point Hotel', 10, 'CM194JS');
INSERT INTO bookings (customer_id, hotel_id, checkin_date, nights) VALUES (1, 1, '2019-10-01', 2);
insert into hotels (name, rooms, postcode) values ('Royal Cosmos Hotel', 5, 'TR209AX');
insert into hotels (name, rooms, postcode) values ('Pacific Petal Motel', 15, 'BN180TG');
--- select <columns that we want to see> from <table-name>
select name, id from customers;
--- select all rows and all columns from hotels table.
select * from hotels h ;
select * from customers c ;
select * from bookings b ;
--- select all hotels which name is "H Hotel"
select * from hotels where name = 'Triple Point Hotel';


