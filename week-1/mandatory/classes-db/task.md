# Class Database

## Submission

Below you will find a set of tasks for you to complete to set up a databases of students and mentors.

To submit this homework write the correct commands for each question here:

``````sql
1. create database cyf_classes;
2. cyf_classes=# CREATE TABLE Mentors(
   cyf_classes(# Name varchar(50) NOT NULL,
   cyf_classes(# YearLivingInGlasgow int,
   cyf_classes(# Address varchar(50),
   cyf_classes(# FavoriteProgrammingLanguage varchar(50));
3. INSERT INTO Mentors (name, yearlivinginglasgow, address, favoriteProgramminglanguage) values ('Anael', 2, 'David Crespo', 'PHP')
   INSERT INTO Mentors (name, yearlivinginglasgow, address, favoriteProgramminglanguage) values ('Omar',1, 'Escultor Canet', 'Java');
   INSERT INTO Mentors (name, yearlivinginglasgow, address, favoriteProgramminglanguage) values ('Giovanna', 10, 'Gran Via de les Corts', 'Javascript');
   INSERT INTO Mentors (name, yearlivinginglasgow, address, favoriteProgramminglanguage) values ('Mario', 4, 'calle Marina', 'C++')
   INSERT INTO Mentors (name, yearlivinginglasgow, address, favoriteProgramminglanguage) values ('Nayla', 3, 'Vic', 'Phyton');
4. CREATE TABLE Students(
   Name varchar(50) NOT NULL,
   Address varchar (50),
   GraduateInMigracode boolean NOT NULL);
5. cyf_classes=# INSERT INTO Students (name, address, graduateinmigracode) values ('Maria', 'calle Mexico', TRUE);
   INSERT 0 1
   cyf_classes=# INSERT INTO Students (name, address, graduateinmigracode) values ('Matias', 'Av. Diagonal', TRUE);
   INSERT 0 1
   cyf_classes=# INSERT INTO Students (name, address, graduateinmigracode) values ('Fran', 'calle Rocafort', TRUE);
   INSERT 0 1
   cyf_classes=# INSERT INTO Students (name, address, graduateinmigracode) values ('Angelo', 'calle Sepulveda', FALSE);
   INSERT 0 1
   cyf_classes=# INSERT INTO Students (name, address, graduateinmigracode) values ('Vannia', 'Av. Melchor', FALSE);
   INSERT 0 1
   cyf_classes=# INSERT INTO Students (name, address, graduateinmigracode) values ('Daniela', 'Av. Ecologica', FALSE);
   INSERT 0 1
   cyf_classes=# INSERT INTO Students (name, address, graduateinmigracode) values ('MIcaela', 'calle Jose Lavandez', FALSE);
   INSERT 0 1
   cyf_classes=# INSERT INTO Students (name, address, graduateinmigracode) values ('Ricardo', 'Av. Tarragona', FALSE);
   INSERT 0 1
   cyf_classes=# INSERT INTO Students (name, address, graduateinmigracode) values ('Andres', 'av. Panamericana', FALSE);
   INSERT 0 1
   cyf_classes=# INSERT INTO Students (name, address, graduateinmigracode) values ('Saul', 'Tarija', TRUE);
   INSERT 0 1
6. cyf_classes=# SELECT * FROM Students;
  name   |       address       | graduateinmigracode 
---------+---------------------+---------------------
 Maria   | calle Mexico        | t
 Matias  | Av. Diagonal        | t
 Fran    | calle Rocafort      | t
 Angelo  | calle Sepulveda     | f
 Vannia  | Av. Melchor         | f
 Daniela | Av. Ecologica       | f
 MIcaela | calle Jose Lavandez | f
 Ricardo | Av. Tarragona       | f
 Andres  | av. Panamericana    | f
 Saul    | Tarija              | t
(10 rows)
cyf_classes=# SELECT * FROM Mentors;
   name   | yearlivinginglasgow |        address        | favoriteprogramminglanguage 
----------+---------------------+-----------------------+-----------------------------
 Anael    |                   2 | David Crespo          | PHP
 Omar     |                   1 | Escultor Canet        | Java
 Giovanna |                  10 | Gran Via de les Corts | Javascript
 Mario    |                   4 | calle Marina          | C++
 Nayla    |                   3 | Vic                   | Phyton
(5 rows)

7. cyf_classes=# CREATE TABLE Classes(
   cyf_classes(# NameMentor varchar (50) NOT NULL,
   cyf_classes(# NameTopic varchar (50) NOT NULL,
   cyf_classes(# DateStart date,
   cyf_classes(# Location varchar (50));
   CREATE TABLE
8. cyf_classes=# INSERT INTO Classes (namementor, nametopic, datestart, location) values ('Jay','Node Js.','2021-09-02',           'Barcelona');
   INSERT 0 1
   cyf_classes=# INSERT INTO Classes (namementor, nametopic, datestart, location) values ('Carlos','Javascript.','2021-05-05', 'Barcelona');
   INSERT 0 1
   cyf_classes=# INSERT INTO Classes (namementor, nametopic, datestart, location) values ('Alexandra','React','2021-07-25', 'Barcelona');
   INSERT 0 1

9.//**CREO UN ID DE LA CLASE Y LO PASO A ESTUDIANTES PARA RELACIONARSE foreign keys**/
   cyf_classes=# ALTER TABLE Classes
   cyf_classes-# ADD COLUMN id SERIAL PRIMARY KEY;

   cyf_classes=# ALTER TABLE students
   cyf_classes-# ADD COLUMN class_id INT REFERENCES classes(id);
   ALTER TABLE

10.-/*Retrieve all the mentors who lived more than 5 years in Glasgow */
   cyf_classes=# SELECT * FROM Mentors WHERE yearlivinginglasgow >5;
   name   | yearlivinginglasgow |        address        | favoriteprogramminglanguage 
----------+---------------------+-----------------------+-----------------------------
 Giovanna |                  10 | Gran Via de les Corts | Javascript
(1 row)

/*- Retrieve all the mentors whose favourite language is Javascript */
   cyf_classes=# SELECT * FROM Mentors WHERE favoriteprogramminglanguage= 'Javascript';
   name   | yearlivinginglasgow |        address        | favoriteprogramminglanguage 
----------+---------------------+-----------------------+-----------------------------
 Giovanna |                  10 | Gran Via de les Corts | Javascript
(1 row)

/* - Retrieve all the students who are CYF graduates*/
   cyf_classes=# SELECT * FROM Students WHERE graduateinmigracode = 'TRUE';
  name  |    address     | graduateinmigracode | class_id 
--------+----------------+---------------------+----------
 Maria  | calle Mexico   | t                   |         
 Matias | Av. Diagonal   | t                   |         
 Fran   | calle Rocafort | t                   |         
 Saul   | Tarija         | t                   |         
(4 rows)
/*- Retrieve all the classes taught before June this year */
   cyf_classes=# SELECT * FROM Classes WHERE datestart < '2021-06-01';
 namementor |  nametopic  | datestart  | location  | id 
------------+-------------+------------+-----------+----
 Carlos     | Javascript. | 2021-05-05 | Barcelona |  2
(1 row)

/*- Retrieve all the students (retrieving student ids only is fine) who attended the Javascript class (or any other class that you have in the `classes` table). CLASS_ID 2 = JAVASCRIPT*/
cyf_classes=# SELECT * FROM Students WHERE class_id= 2;
  name   |       address       | graduateinmigracode | class_id 
---------+---------------------+---------------------+----------
 Fran    | calle Rocafort      | t                   |        2
 Vannia  | Av. Melchor         | f                   |        2
 MIcaela | calle Jose Lavandez | f                   |        2
(3 rows)


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
