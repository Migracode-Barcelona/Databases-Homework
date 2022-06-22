# Class Database

## Submission

Below you will find a set of tasks for you to complete to set up a databases of students and mentors.

To submit this homework write the correct commands for each question here:

```sql
1.
createdb cyf_classes
psql cyf_classes

2.
CREATE TABLE mentors (
  id        SERIAL PRIMARY KEY,
  name      VARCHAR(30) NOT NULL,
  glasgow_years     int NOT NULL,
  address   VARCHAR(120),
  fav_prog_language      VARCHAR(50)
);

3.
INSERT INTO mentors (name, glasgow_years, address, fav_prog_language) VALUES ('John Smith','2','11 New Road','React');
INSERT INTO mentors (name, glasgow_years, address, fav_prog_language) VALUES ('Daniel Doe','1','11 New Road','Node');
INSERT INTO mentors (name, glasgow_years, address, fav_prog_language) VALUES ('Javier Perez','5','11 New Road','Java');
INSERT INTO mentors (name, glasgow_years, address, fav_prog_language) VALUES ('Enrique García','4','11 New Road','PHP');
INSERT INTO mentors (name, glasgow_years, address, fav_prog_language) VALUES ('Valentina Lopez','2','11 New Road','Python');

4.
CREATE TABLE students (
  id        SERIAL PRIMARY KEY,
  name      VARCHAR(30) NOT NULL,
  address   VARCHAR(120),
  graduated      VARCHAR(5)
);

5.
INSERT INTO students (name,address,graduated) VALUES
	 ('John Nava','2 New Road','yes'),
	 ('Alexender Flaming','7 Lluna','no'),
	 ('Stuard Broad','10 Sant Pau','no'),
	 ('Gayle Jordan','11 West Feri','yes'),
	 ('Leoarndo Rafsan','21 Hamilton Road','yes'),
    ('Victar Alex','12 Dock Road','yes'),
	 ('Nicolas Fernandes','14 Charls Road','yes'),
	 ('Franko Albert','27 Dhanmondi','yes'),
	 ('Newton Dario','11 Banani','no'),
	 ('Juan Albez','15 Paloma','yes');
    
    
6.
SELECT * from mentors;
SELECT * from students;

7.
CREATE TABLE classes (
  id        SERIAL PRIMARY KEY,
  mentor_id INT REFERENCES mentors(id),
  topic      VARCHAR(30),
  date   DATE NOT NULL,
  location      VARCHAR(30) NOT NULL
);

8.    
INSERT INTO classes (mentor_id,topic,"date","location") VALUES
	 (1,'Node','2020-11-30','online'),
	 (2,'Java','2020-11-30','online'),
	 (3,'C++','2020-11-30','online');

9.
CREATE TABLE attendance (
  id        SERIAL PRIMARY KEY,
  student_id INT REFERENCES students(id),
  class_id INT REFERENCES classes(id)
);

INSERT INTO attendance (student_id,class_id) VALUES
	 (1,2),
    (3,2),
    (2,1),
    (4,1);

10.
 Retrieve all the mentors who lived more than 5 years in Glasgow
    - Retrieve all the mentors whose favourite language is Javascript
    
    SELECT * FROM mentors WHERE fav_prog_language = 'Javascript';
    
    - Retrieve all the students who are CYF graduates
    
    SELECT * FROM students WHERE graduated = 'yes';
    
    - Retrieve all the classes taught before June this year
    
    SELECT * FROM classes WHERE date < '2022-02-02';
    
    - Retrieve all the students (retrieving student ids only is fine) who attended the Javascript class (or any other class that you have in the `classes` table).
    
    select * FROM students WHERE id in (SELECT student_id FROM attendance WHERE class_id = 1);
    SELECT students.name FROM students INNER JOIN attendance ON (students.id = attendance.student_id) INNER JOIN classes ON (classes.id = attendance.class_id) WHERE classes.topic='Node';
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
