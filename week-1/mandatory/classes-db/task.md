# Class Database

## Submission

Below you will find a set of tasks for you to complete to set up a databases of students and mentors.

To submit this homework write the correct commands for each question here:

```sql
CREATE TABLE mentors (
  id							SERIAL primary key,
  name 							VARCHAR(30) not null,
  years_lived_in_Glasgow         SMALLINT NOT null,
  address                        VARCHAR(120),
  favourite_programming_language VARCHAR(30) 
  );
  
INSERT INTO mentors (name, years_lived_in_Glasgow, address, favourite_programming_language) VALUES ('John', 23, '44 Red Road', 'JavaScript' );
INSERT INTO mentors (name, years_lived_in_Glasgow, address, favourite_programming_language) VALUES ('Joe', 24, '45 Red Road', 'Java' );
INSERT INTO mentors (name, years_lived_in_Glasgow, address, favourite_programming_language) VALUES ('Jane', 25, '46 Red Road', 'C++' );
INSERT INTO mentors (name, years_lived_in_Glasgow, address, favourite_programming_language) VALUES ('Jenny', 26, '47 Red Road', 'Python' );
INSERT INTO mentors (name, years_lived_in_Glasgow, address, favourite_programming_language) VALUES ('Joey', 27, '48 Red Road', '.NET' );


select * from mentors;


CREATE TABLE students (
  id							SERIAL primary key,
  name 							VARCHAR(30) not null,
  address                        VARCHAR(120),
  has_graduated					 BOOLEAN
  );
  
INSERT into students (name, address, has_graduated) VALUES ('Mehtap', 'Industria 63', TRUE );
INSERT into students (name, address, has_graduated) VALUES ('Joe', 'Industria 64', TRUE );
INSERT into students (name, address, has_graduated) VALUES ('Montse', 'Industria 65', TRUE ); 
INSERT into students (name, address, has_graduated) VALUES ('Johhny', 'Industria 66', FALSE );
INSERT into students (name, address, has_graduated) VALUES ('Ricard', 'Industria 67', TRUE );
INSERT into students (name, address, has_graduated) VALUES ('Meto', 'Industria 68', TRUE );
INSERT into students (name, address, has_graduated) VALUES ('Juan', 'Industria 69', TRUE );
INSERT into students (name, address, has_graduated) VALUES ('Miguel', 'Industria 70', FALSE );
INSERT into students (name, address, has_graduated) VALUES ('Lol', 'Industria 71', TRUE );
INSERT into students (name, address, has_graduated) VALUES ('Fernando', 'Industria 72', FALSE );

select * from students;

-- delete from students where name="alice";
 
 
 SELECT * FROM students where has_graduated=true
 
 --delete from students where id=10;
 
 
 CREATE TABLE classes (
  id        SERIAL PRIMARY KEY,
  mentor_id INT REFERENCES mentors(id),
  topic      VARCHAR(30),
  date   DATE NOT NULL,
  location      VARCHAR(30) NOT NULL
);
 INSERT INTO classes (mentor_id, topic, date, location) VALUES (1, 'Python','2021-11-11','Barcelona');
 INSERT INTO classes (mentor_id, topic, date, location) VALUES (2, 'Java','2021-11-09','Barcelona');
 INSERT INTO classes (mentor_id, topic, date, location) VALUES (3, 'JavaScript','2021-11-04','Barcelona');


select * from classes 


create table attendance (
	id				SERIAL primary key,
	student_id 		INT REFERENCES students(id),
	class_id		INT REFERENCES classes(id)
);

select * from attendance;

 INSERT INTO attendance (student_id, class_id) values (5,3);
 INSERT INTO attendance (student_id, class_id) values  (5,4); 
 INSERT INTO attendance (student_id, class_id) values  (7,3);
 INSERT INTO attendance (student_id, class_id) values  (5,6);


--SELECT MENTORS WITH 5 YEARS RECIDENCY IN GLASGOW
select * from mentors ;
select * from mentors where years_lived_in_glasgow >= 5;

--FAV LANGUAGE IS JS

select name, favourite_programming_language from mentors
where favourite_programming_language = "JavaScript";


--GRADUATED STUDENTS 

select * from students where has_graduated is true;

--BEFORE JUNE CLASSES

select * from classes where date < '2021-11-10';

-- STUDENTS TAKE JS

select student_id from attendance where class_id = 3;

-- 



 

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
