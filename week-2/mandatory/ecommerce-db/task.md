# E-Commerce Database

In this homework, you are going to work with an ecommerce database. In this database, you have `products` that `consumers` can buy from different `suppliers`. Customers can create an `order` and several products can be added in one order.

## Submission

Below you will find a set of tasks for you to complete to set up a databases of students and mentors.

To submit this homework write the correct commands for each question here:

```sql

-- Retrieve all the customers names and addresses who lives in United States
SELECT customers.name, customers.address, customers.country
FROM customers
WHERE customers. country = 'United States';
--Retrieve all the customers ordered by ascending name
select * from customers order by name;
select * from customers order by name asc ;
--Retrieve all the products which cost more than 100
select * from products where unit_price > 100;
select * from products;
--Retrieve all the products whose name contains the word socks
select * from products where product_name  like '%socks%';
select * from products;
--Retrieve the 5 most expensive products
select unit_price,product_name  from products order by unit_price  desc limit 5;
--Retrieve all the products with their corresponding suppliers. The result should only contain
--the columns product_name, unit_price and supplier_name
select * from suppliers;
select products.product_name, products.unit_price ,suppliers.supplier_name from products 
inner join suppliers on products.supplier_id =suppliers.id;

--Retrieve all the products sold by suppliers based in the United Kingdom. The result should only contain 
--the columns product_name and supplier_name
select products.product_name ,suppliers.supplier_name from products inner join suppliers 
on products.supplier_id =suppliers.id
where suppliers.country ='United Kingdom';
--Retrieve all orders from customer ID 1
select * from orders;
select * from customers;
select * from orders where customer_id =1;
--Retrieve all orders from customer named Hope Crosby
select * from  orders join customers  on orders.customer_id = customers.id  where customers.name ='Hope Crosby';
--Retrieve all the products in the order ORD006. The result should only contain the columns product_name, unit_price and quantity
select products.product_name, products.unit_price, order_items.quantity from products join order_items
on products.id =order_items.product_id 
inner join orders on orders.id = order_items.order_id 
where orders.order_reference ='ORD006';

select * from order_items;
--Retrieve all the products with their supplier for all orders of all customers. 
--The result should only contain the columns name (from customer), order_reference order_date, product_name, supplier_name and quantit
select customers.name, orders.order_reference, orders.order_date, products.product_name,
suppliers.supplier_name, order_items.quantity from customers
inner join orders on customers.id =orders.customer_id
inner join order_items on order_items.order_id = orders.id
inner join products on products.id = order_items.product_id 
inner join suppliers on suppliers.id = products.supplier_id;
--Retrieve the names of all customers who bought a product from a supplier from China
select customers.name from customers inner join orders on customers.id =orders.customer_id
inner join order_items  on order_items.order_id = orders.id 
inner join products on products.id = order_items.product_id 
inner join suppliers on suppliers.id = products.supplier_id 
where suppliers.country ='China'
```

When you have finished all of the questions - open a pull request with your answers to the `Databases-Homework` repository.

## Setup

To prepare your environment for this homework, open a terminal and create a new database called `cyf_ecommerce`:

```sql
createdb cyf_ecommerce
```

Import the file [`cyf_ecommerce.sql`](./cyf_ecommerce.sql) in your newly created database:

```sql
psql -d cyf_ecommerce -f cyf_ecommerce.sql
```

Open the file `cyf_ecommerce.sql` in VSCode and make sure you understand all the SQL code. Take a piece of paper and draw the database with the different relations between tables. Identify the foreign keys and make sure you understand the full database schema.

## Task

Once you understand the database that you are going to work with, solve the following challenge by writing SQL queries using everything you learned about SQL:

1. Retrieve all the customers names and addresses who lives in United States
2. Retrieve all the customers ordered by ascending name
3. Retrieve all the products which cost more than 100
4. Retrieve all the products whose name contains the word `socks`
5. Retrieve the 5 most expensive products
6. Retrieve all the products with their corresponding suppliers. The result should only contain the columns `product_name`, `unit_price` and `supplier_name`
7. Retrieve all the products sold by suppliers based in the United Kingdom. The result should only contain the columns `product_name` and `supplier_name`.
8. Retrieve all orders from customer ID `1`
9. Retrieve all orders from customer named `Hope Crosby`
10. Retrieve all the products in the order `ORD006`. The result should only contain the columns `product_name`, `unit_price` and `quantity`.
11. Retrieve all the products with their supplier for all orders of all customers. The result should only contain the columns `name` (from customer), `order_reference` `order_date`, `product_name`, `supplier_name` and `quantity`.
12. Retrieve the names of all customers who bought a product from a supplier from China.
