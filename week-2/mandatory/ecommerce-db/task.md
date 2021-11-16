# E-Commerce Database

In this homework, you are going to work with an ecommerce database. In this database, you have `products` that `consumers` can buy from different `suppliers`. Customers can create an `order` and several products can be added in one order.

## Submission

Below you will find a set of tasks for you to complete to set up a databases of students and mentors.

To submit this homework write the correct commands for each question here:

```sql
1. select name, address from customers where country='United States'; 

2. select * from customers order by name asc; 

3. select * from products where unit_price > 100;

4. select * from products where product_name like '%socks%';

5. SELECT * FROM products ORDER BY unit_price desc limit 5;

6. select product_name, unit_price, supplier_name from products
    left join suppliers on supplier_id=products.supplier_id; 

7. select product_name, supplier_name from products 
    join suppliers on suppliers.id= products.supplier_id  
    where suppliers.country = 'United Kingdom'; 

8. select * from orders where customer_id = 1;

9. select name, order_reference, order_date from orders 
    left join customers on customers.id=orders.customer_id
    where customers.name = 'Hope Crosby';

10. select product_name, unit_price, quantity from products as p
    join order_items as oi on oi.product_id = p.id
    join orders as o on o.id = oi.order_id 
    where o.order_reference = 'ORD006';

11. select name, order_reference, order_date, product_name, supplier_name, quantity from customers as cus
    join orders as o on o.customer_id = cus.id 
    join order_items as oi on oi.order_id = o.id 
    join products as pro on pro.id = oi.product_id 
    join suppliers as s on s.id = pro.supplier_id ;

12. select name, suppliers.country from customers
    cross join suppliers 
    where suppliers.country ='China'


```
1
When you have finished all of the questions - open a pull request with your answers to the `Databases-Homework` repository.

## Setup

To prepare your environment for this homework, open a terminal and create a new database called `cyf_ecommerce`:

```sql
createdb cyf_ecommerce
```

Import the file [`cyf_ecommerce.sql`](./cyf_ecommerce.sql) in your newly created database:

```sql

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
