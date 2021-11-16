# Class Database

## Submission

Below you will find a set of tasks for you to complete to set up a databases of students and mentors.

To submit this homework write the correct commands for each question here:

```sql
TASK
1. create database cyf_classes; 
   \c cyf_classes; to connect to that database.
2. create table mentors(id serial primary key, name varchar(40) not null, years_in_Glasgow int, address varchar(50), pgm_language varchar(50));
3.INSERT INTO mentors (id serial primary key, name, years_in_glasgow, address, pgm_language) 
   VALUES   ('Juan Arrazal', 4, '301 Argyle St G2 82L', 'JavaScript')
            ('John Brianten', 30, '11 Blythwood Square G24AD', 'Python'),
            ('Sara Berlinger', 7, '33 Gordon St G13SL', 'Python, C++'),
            ('Samantha Saransan', 12, '16 S Frederick St G11HJ', 'PHP'),
            ('Claudio Paul Caniggia', 2, '150 Edmiston Dr G51 2XD', 'Java');
4. create table students(name varchar(50) not null, address varchar(50), graduated BOOLEAN);
5. INSERT INTO students (name, address, graduated) 
   VALUES   ('Pepe Monje','2 Hill St G36RN','t'),
            ('Zenon Paprika', '83 Wannabe Rd G63CZ', 'f'),
            ('Will Parnasus','12 Wallace St H23JC', 't'),
            ('Dora Explorer', '69 Brickell Key Drive H23JC','t'),
            ('Xavier Rodbel', '931 Sarmient St A64F', 'f'),
            ('Clancy Wiggum', '123 False St F32PN', 'f'),
            ('Diego Funck', '253 Waterloo St F32PN', 't'),
            ('Michael Jordan', '23 Chicago St H65PL', 'f'),
            ('Mark Renton', '43 Off Rd H65PL', 'f'),
            ('Francis Begbie','43 Siracusa St Y53NL', 'f');
6. select * from students; 
   select * from mentors;
7. create table classes(id serial primary key, topic varchar(20) not null, mentor varchar(50), date date, location varchar(50));
8. INSERT INTO classes (topic, mentor, date, location) VALUES ('Java Script', 'Juan Arrazal', '2021-08-01', '12 Horizon St H67JK');
   - ALTER TABLE classes ADD student_id int constraint fk_student_id references students(id); <<<CREE COLUMNA student_id QUE HACE REFERENCIA AL ID DE LA TABLA students>>>. Lo mismo hice con mentors. 
9. create table attendances (id serial primary key, class int references classes(id), student int references students(id));
10.
   _ select * from mentors where years_in_glasgow>5;
   _ select * from mentors where pgm_language = 'JavaScript';
   _ select * from students where graduated ='t';
   _ select * from classes where date < '2021-06-30';
   _ select s.id, name from students as s
      left join attendances as a on a.student=s.id
      where class=2;

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
