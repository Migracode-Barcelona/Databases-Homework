# E-Commerce Database

In this homework, you are going to work with an ecommerce database. In this database, you have `products` that `consumers` can buy from different `suppliers`. Customers can create an `order` and several products can be added in one order.

## Submission

Below you will find a set of tasks for you to complete to set up a databases of students and mentors.

To submit this homework write the correct commands for each question here:

```sql
1. Retrieve all the customers names and addresses who lives in United States
select name, address from customers c where country = 'United States';
2. Retrieve all the customers ordered by ascending name
select * from customers c order by name;
3. Retrieve all the products which cost more than 100
select * from products where unit_price > 100;
4. Retrieve all the products whose name contains the word `socks`
select * from products p where product_name like '%socks%';
5. Retrieve the 5 most expensive products
select * from products order by unit_price desc limit 5;
6. Retrieve all the products with their corresponding suppliers. The result should only contain the columns `product_name`, `unit_price` and `supplier_name`
select p.product_name, p.unit_price, s.supplier_name from products p inner join suppliers s on s.id = p.supplier_id ;
7. Retrieve all the products sold by suppliers based in the United Kingdom. The result should only contain the columns `product_name` and `supplier_name`.
select p.product_name, s.supplier_name from products p inner join suppliers s on s.id = p.supplier_id where s.country = 'United Kingdom';
8. Retrieve all orders from customer ID `1`
select * from orders o where customer_id = 1;
9. Retrieve all orders from customer named `Hope Crosby`
select * from orders o inner join customers c on c.id = o.customer_id where c."name" = 'Hope Crosby';
10. Retrieve all the products in the order `ORD006`. The result should only contain the columns `product_name`, `unit_price` and `quantity`.
select p.product_name, p.unit_price, oi.quantity from products p inner join order_items oi on p.id = oi.product_id inner join orders o on o.id = oi.order_id where o.order_reference = 'ORD006';
11. Retrieve all the products with their supplier for all orders of all customers. The result should only contain the columns `name` (from customer), `order_reference` `order_date`, `product_name`, `supplier_name` and `quantity`.
select c."name", o.order_reference, o.order_date, p.product_name, s.supplier_name, oi.quantity from customers c inner join orders o on c.id = o.customer_id inner join order_items oi on o.id = oi.order_id inner join products p on p.id = oi.product_id inner join suppliers s on s.id = p.supplier_id;
12. Retrieve the names of all customers who bought a product from a supplier from China.
select c."name", p.product_name, p.id from customers c inner join orders o on c.id = o.customer_id inner join order_items oi on o.id = oi.order_id inner join products p on p.id = oi.product_id inner join suppliers s on s.id = p.supplier_id where s.country = 'China';
----EXTRAS
--- get the top 5 suppliers who sell the most.
select s.supplier_name , s.id, p.supplier_id, p.product_name , p.id, oi.product_id, oi.quantity from suppliers s inner join products p on s.id = p.supplier_id inner join order_items oi on p.id = oi.product_id order by oi.quantity desc limit 5;
--- get top 3 customers that are buying more.
select c."name", SUM(oi.quantity) as total from customers c inner join orders o on c.id = o.customer_id inner join order_items oi on o.id = oi.order_id inner join products p on p.id = oi.product_id group by c."name" order by total desc limit 3;

--to check  the above
select oi.quantity from order_items oi inner join orders o on o.id = oi.order_id inner join customers c on c.id = o.customer_id where c."name" = 'Amber Tran';

select c."name" , SUM (p.unit_price * oi.quantity ) as total from customers c inner join orders o on c.id = o.customer_id inner join order_items oi on o.id = oi.order_id inner join products p on p.id = oi.product_id
group by c."name"
order by total desc;

--- get the top 2 products that are bought most times. Who is selling those products?
select s.supplier_name, p.product_name, oi.quantity from suppliers s inner join products p on s.id = p.supplier_id inner join order_items oi on p.id =oi.product_id order by oi.quantity desc limit 5;

--- get the products that a customer bought based on user name.
select p.product_name, c."name" from customers c inner join orders o on c.id = o.customer_id inner join order_items oi on o.id = oi.order_id inner join products p on p.id = oi.product_id where c.name = '';

--- One of our suppliers, Amazon, has detected an issue for the following products: Javascript Book and Ball.
--Inform the users that bought those products (from amazon) that they will be refunded
select c."name", p.product_name, p.id from customers c inner join orders o ON c.id = o.customer_id inner join order_items oi on o.id = oi.order_id inner join products p on p.id = oi.product_id where p.supplier_id = 1 and (p.product_name = 'Javascript Book' or p.product_name = 'Ball');
select * from products p2 ;
-- Allow suppliers to add and remove the products they are providing.
select p.product_name, s.supplier_name from products p inner join suppliers s on s.id = p.supplier_id;



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
