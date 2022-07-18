# Class Database

## Submission

Below you will find a set of tasks for you to complete to set up a databases of students and mentors.

To submit this homework write the correct commands for each question here:

```sql

CREATE TABLE mentors(
    id SERIAL PRIMARY KEY,
    name VARCHAR(30) NOT NULL,
    years_in_glasgow SMALLINT NOT null,
    address VARCHAR(100) NOT null,
    favourite_language VARCHAR(25) NOT null
);

INSERT INTO mentors (name, years_in_glasgow, address, favourite_language)
VALUES ('John', 23, '44 Red Road', 'JavaScript' );

INSERT INTO mentors (name, years_in_glasgow, address, favourite_language)
VALUES ('Jack', 5, '44 Santa Maria 34', 'JavaScript' );

INSERT INTO mentors (name, years_in_glasgow, address, favourite_language)
VALUES ('Fernando', 31, '22 Green Road', 'React');

INSERT INTO mentors (name, years_in_glasgow, address, favourite_language)
VALUES ('Jane', 5, 'Marina Street 67', 'Java');

INSERT INTO mentors (name, years_in_glasgow, address, favourite_language)
VALUES ('Ana', 50, '5th Avenue, 45', 'C++');

-- create a new table students, for each student we want to save their name,
-- address and if they have graduated from Code Your Future.

CREATE TABLE students(
    id SERIAL PRIMARY KEY,
    name VARCHAR(30) NOT NULL,
    address VARCHAR(100) NOT NULL,
    graduated_from_code_your_future BOOLEAN
);

INSERT INTO students (name, address, graduated_from_code_your_future)
VALUES ('Barbara', '2 High Road', TRUE);

INSERT INTO students (name, address, graduated_from_code_your_future)
VALUES ('Mehtap', 'Industria 63', TRUE );

INSERT INTO students (name, address, graduated_from_code_your_future)
VALUES ('Burçak', 'Carrer dels Pescadors', TRUE);

INSERT INTO students (name, address, graduated_from_code_your_future)
VALUES ('John', 'Siguenza 117' , TRUE);

INSERT INTO students (name, address, graduated_from_code_your_future)
VALUES ('Johni deep', 'calle de Amber', TRUE);

INSERT INTO students (name, address, graduated_from_code_your_future)
VALUES ('Kofi', 'carrer sant migel 6', FALSE);

INSERT INTO students (name, address, graduated_from_code_your_future)
VALUES ('Isha', 'Calle de Virgilli', TRUE );

INSERT INTO students (name, address, graduated_from_code_your_future)
VALUES ('Paul', '4th Street', TRUE);

INSERT INTO students (name, address, graduated_from_code_your_future)
VALUES ('Usman Ghani', 'corts Catalaness', TRUE);

INSERT INTO students (name, address, graduated_from_code_your_future)
VALUES ('Gloria', 'carrer nou de santa clara 15 ', FALSE);


CREATE TABLE classes(
     id SERIAL PRIMARY KEY,
     -- A class has a leading mentor
     mentor_id INT REFERENCES mentors(id),
     topic VARCHAR(30),
     date DATE NOT NULL,
     location VARCHAR(30) NOT NULL
);

INSERT INTO  classes (mentor_id, topic, date, location)
VALUES (1, 'JavaScript', '2022-01-01','Barcelona');

INSERT INTO  classes (mentor_id, topic, date, location)
VALUES (2, 'Java', '2022-01-01','Barcelona');

INSERT INTO  classes (mentor_id, topic, date, location)
VALUES (3, 'Phyton', '2022-02-02','Barcelona');


create table attendance(
      id SERIAL primary key,
      student_id INT references students(id),
      class_id INT references classes(id)
);

INSERT INTO attendance (student_id, class_id) values (5,3);
INSERT INTO attendance (student_id, class_id) values (5,4);
INSERT INTO attendance (student_id, class_id) values (7,3);
INSERT INTO attendance (student_id, class_id) values (5,6);

SELECT * FROM mentors;
SELECT * FROM mentors
WHERE years_in_glasgow >= 5;
SELECT name, favourite_programming_language FROM mentors
WHERE favourite_programming_language = "JavaScript";

SELECT * FROM students;
SELECT * FROM students
WHERE graduated_from_code_your_future IS TRUE;

DELETE FROM students
WHERE name = 'JOHN';

SELECT * FROM classes;

SELECT * FROM attendance;
SELECT student_id FROM attendance WHERE class_id = 1;


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
