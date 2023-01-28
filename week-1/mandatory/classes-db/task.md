# Class Database

## Submission

Below you will find a set of tasks for you to complete to set up a databases of students and mentors.

To submit this homework write the correct commands for each question here:

```sql
drop table if exists class_attendance;
drop table if exists classes;
drop table if exists students;
drop table if exists mentors;




create table if not exists mentors (
 id 					serial primary key,
 name 					varchar(30) not null,
 glassgow_living_period	smallint not null,
 address 				varchar(120) not null,
 fav_PL 				varchar(30)
);


create table if not exists students(
 id 			serial primary key,
 name 			varchar(30) not null,
 address 		varchar(120) not null,
 graduated 		boolean
);


create table if not exists classes(
 id 			serial primary key,
 mentor_id 		int References mentors(id),
 topic 			varchar(60),
 taught_date 	date not null,
 address 		varchar(60)
);

create table if not exists class_attendance(
 id 			serial primary key,
 student_id		int references students(id),
 class_id		int references classes(id)
);


insert into mentors (name, glassgow_living_period, address, fav_pl)
values ('marco', 3, 'barcelon', 'javascript'),
('mali', 4, 'barcelona', 'sql'),
('ali', 2, 'madrid', 'php'),
('carlos', 9, 'valencia', 'javascript'),
('pedro', 6, 'toledo', 'c++'),
('alex', 4, 'lleida', 'javascript'),
('mani', 8, 'jaca', 'typescript');

insert into students(name, address, graduated)
values ('ali', 'barcelona', false ),
('abubakar', 'madrid', true ),
('pedro', 'zargoza', false ),
('carlos', 'barcelona', true ),
('mani', 'lleida', false ),
('marco', 'valencia', true ),
('hafiz', 'bcn', true ),
('manpreet', 'portugal', true ),
('nuno', 'cordoba', false );

insert into classes (mentor_id, taught_date)
values(5, '2022/12/10'),
(3, '2022/02/04');
insert into classes (mentor_id, taught_date, topic) values(1, '2021/10/15', 'javascript');


insert into class_attendance (student_id, class_id)
values(5,3),(3,2),(4,2),(1,3);

select * from mentors;
select * from students limit 3;
select * from students where graduated = true limit 3;
select * from students where name like 'a%' limit 2;
select s.name from class_attendance as ca
join students as s
on ca.student_id=s.id
where s.name like 'm%'
limit 4;

select s.name from class_attendance as ca
join students as s
on ca.student_id=s.id
join classes as c
on c.id = ca.class_id
where c.taught_date = '2022/12/10';

select * from mentors where glassgow_living_period > 5;
select * from mentors where fav_pl = 'javascript';



```

When you have finished all of the questions - open a pull request with your answers to the `Databases-Homework` repository.

## Task

1. Create a new database called `cyf_classes` (hint: use `createdb` in the terminal)
2. Create a new table `mentors`, for each mentor we want to save their name, how many years they lived in Glasgow, their address and their favourite programming language.
3. Insert 5 mentors in the `mentors` table (you can make up the data, it doesn't need to be accurate ;-)).
4. Create a new table `students`, for each student we want to save their name, address and if they have graduated from Code Your Future.
5. Insert 10 students in the `students` table.
6. Verify that the data you created for mentors and students are correctly stored in their respective tables (hint: use a `select` SQL statement).
7. Create a new `classes` table to record the following information:

   - A class has a leading mentor
   - A class has a topic (such as Javascript, NodeJS)
   - A class is taught at a specific date and at a specific location

8. Insert a few classes in the `classes` table
9. We now want to store who among the students attends a specific class. How would you store that? Come up with a solution and insert some data if you model this as a new table.
10. Answer the following questions using a `select` SQL statement:
    - Retrieve all the mentors who lived more than 5 years in Glasgow
    - Retrieve all the mentors whose favourite language is Javascript
    - Retrieve all the students who are CYF graduates
    - Retrieve all the classes taught before June this year
    - Retrieve all the students (retrieving student ids only is fine) who attended the Javascript class (or any other class that you have in the `classes` table).
