# Class Database

## Submission

Below you will find a set of tasks for you to complete to set up a databases of students and mentors.

To submit this homework write the correct commands for each question here:

```sql


```

When you have finished all of the questions - open a pull request with your answers to the `Databases-Homework` repository.

## Task

1. Create a new database called `cyf_classes` (hint: use `createdb` in the terminal)
 creatdb cyf_classes
3. 
4. Create a new table `mentors`, for each mentor we want to save their name, how many years they lived in Glasgow, their address and their favourite programming language.

create table mentors (
	id SERIAL primary key,
	name VARCHAR(30) NOT NULL,
	years_in_glasgow SMALLINT not null,
	favourite_language VARCHAR(25) not null,
	address VARCHAR(100) not null
);

6. Insert 5 mentors in the `mentors` table (you can make up the data, it doesn't need to be accurate ;-)).

select * from mentors;
insert into mentors (name,years_in_glasgow,address,favourite_language) values ('jhon',2,'44 red road', 'javascript');
insert into mentors (name,years_in_glasgow,address,favourite_language) values ('alejandro',20,'40 red road', 'javascript');
insert into mentors (name,years_in_glasgow,address,favourite_language) values ('ananda',15,'green road', 'java');
insert into mentors (name,years_in_glasgow,address,favourite_language) values ('lino',23,'barcelona', 'node.js');
insert into mentors (name,years_in_glasgow,address,favourite_language) values ('pablu',23,'gracia', 'javascript');
insert into mentors (name,years_in_glasgow,address,favourite_language) values ('usman',5,'pakistan', 'python');

8. Create a new table `students`, for each student we want to save their name, address and if they have graduated from Code Your Future.

create table students(
	id SERIAL primary key,
	name VARCHAR(30) NOT NULL,
	address VARCHAR(100) not null,
	graduated_from_code_your_future BOOLEAN
);

10. Insert 10 students in the `students` table.

INSERT INTO students (name, address, graduated_from_code_your_future) VALUES ('Alix', '2 High Road',true);
 INSERT INTO students (name, address, graduated_from_code_your_future) VALUES ('Mani', '33 High Road',false);
 INSERT INTO students (name, address, graduated_from_code_your_future) VALUES ('baber', '4 Preston Road',false);
 INSERT INTO students (name, address, graduated_from_code_your_future) VALUES ('Rizwan', '133 Preston Road',true);
 INSERT INTO students (name, address, graduated_from_code_your_future) VALUES ('Asaad', '77 Town Lane',true);
 INSERT INTO students (name, address, graduated_from_code_your_future) VALUES ('Shaheen', '15 Blue Road',false);
 INSERT INTO students (name, address, graduated_from_code_your_future) VALUES ('Afredi', '11 Main Avenue',true);
 INSERT INTO students (name, address, graduated_from_code_your_future) VALUES ('Amir', '33 Town Lane',true);
 INSERT INTO students (name, address, graduated_from_code_your_future) VALUES ('waseem', '22 Green Lane',false);
 INSERT INTO students (name, address, graduated_from_code_your_future) VALUES ('Hassan', '77 Yellow Street',true);
 
12. Verify that the data you created for mentors and students are correctly stored in their respective tables (hint: use a `select` SQL statement).

select * from students;


14. Create a new `classes` table to record the following information:

   - A class has a leading mentor
   - A class has a topic (such as Javascript, NodeJS)
   - A class is taught at a specific date and at a specific location

create table classes (
	id SERIAL primary key,
	-- A class has a leading mentor
	mentor_id INT references mentors(id),
	topic varchar(50) not null,
	-- A class is taught at a specific date and at a specific location
	date   DATE NOT NULL,
  	location VARCHAR(50) NOT NULL
);

8. Insert a few classes in the `classes` table

insert into classes (mentor_id, topic, date, location) values (1, 'Java', '2021-11-11', 'Barcelona');
insert into classes (mentor_id, topic, date, location)  values (2, 'python', '2020-12-12', 'Valencia');
insert into classes (mentor_id, topic, date, location)  values (3, 'machine Learning', '2020-12-12', 'Pakistan');

10. We now want to store who among the students attends a specific class. How would you store that? Come up with a solution and insert some data if you model this as a new table.

create table attendance (
	id SERIAL primary key,
	student_id int references students(id),
	class_id int references classes(id)
);

12. Answer the following questions using a `select` SQL statement:
    - Retrieve all the mentors who lived more than 5 years in Glasgow

select * from mentors where years_in_glasgow > 5;

    - Retrieve all the mentors whose favourite language is Javascript
    
    select * from mentors
where favourite_language = 'javascript';

    - Retrieve all the students who are CYF graduates
    
    select * from students where graduated_from_code_your_future =true;
    
    - Retrieve all the classes taught before June this year
    
    select * from classes where date < '2021-06-10';
    
    - Retrieve all the students (retrieving student ids only is fine) who attended the Javascript class (or any other class that you have in the `classes` table).
    select student_id from attendance
where class_id = 3;
