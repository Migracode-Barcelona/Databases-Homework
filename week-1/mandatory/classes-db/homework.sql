drop table if exists attendance;
drop table if exists classes;
drop table if exists mentors;
drop table if exists students;


--2. Create a new table `mentors`, for each mentor we want to save their name, how many years they lived in Glasgow, their address and their favourite programming language.
create table mentors ( 
id SERIAL primary key,
mentorName VARCHAR(30) not null,
yearsInGlasgow INT,
address VARCHAR(120),
favProgLang VARCHAR(30) );

--3. Insert 5 mentors in the `mentors` table (you can make up the data, it doesn't need to be accurate ;-)).
insert	into mentors (mentorName,	yearsinglasgow,	address, favproglang) values ('John Smith',5,'C/ Carders 32','Java');
insert	into mentors (mentorName,	yearsinglasgow,	address, favproglang) values ('Lilac Lane',2,'2197 Prospect Valley Road','JavaScript');
insert	into mentors (mentorName,	yearsinglasgow,	address, favproglang) values ('Sarah Harris',6,'96 Thames Street','Swift');
insert	into mentors (mentorName,	yearsinglasgow,	address, favproglang) values ('Thomas Keough',1,'92 Academy Street','JavaScript');
insert	into mentors (mentorName,	yearsinglasgow,	address, favproglang) values ('Betty W. Mitchell',1,'75 Freezeland Lane','Swift');


--4. Create a new table `students`, for each student we want to save their name, address and if they have graduated from Code Your Future.
create table students ( 
id SERIAL primary key,
studentName VARCHAR(30) not null,
address VARCHAR(120),
isGradCYF BOOLEAN not null);


--5. Insert 10 students in the `students` table.
insert into	students (studentName,	address, isGradCYF) values ('Jeffrey J. Eckhardt', '66 Bridge Street', true);
insert into	students (studentName,	address, isGradCYF) values ('Raymond T. Prince', '1 Walwyn Rd', false);
insert into	students (studentName,	address, isGradCYF) values ('Lucille J. McManus', '93 Wenlock Terrace', true);
insert into	students (studentName,	address, isGradCYF) values ('Justin R. Dorr', '28 St Maurices Road', false);
insert into	students (studentName,	address, isGradCYF) values ('Mark C. Carney', '11 Hampton Court Rd', false);
insert into	students (studentName,	address, isGradCYF) values ('Kimberly J. Fikes', '63 Layburn Court', true);
insert into	students (studentName,	address, isGradCYF) values ('Nathaniel A. Lambert', '63 Old Chapel Road', true);
insert into	students (studentName,	address, isGradCYF) values ('Joanne A. Ream', '15 Guild Street', true);
insert into	students (studentName,	address, isGradCYF) values ('Margaret M. Key', '92 South Street', false);
insert into	students (studentName,	address, isGradCYF) values ('Lucile M. Wallace', '14 Harrogate Road', false);


--6. Verify that the data you created for mentors and students are correctly stored in their respective tables (hint: use a `select` SQL statement).
select * from mentors;
select * from students;


--7. Create a new `classes` table to record the following information:
   -- A class has a leading mentor
   -- A class has a topic (such as Javascript, NodeJS)
   -- A class is taught at a specific date and at a specific location
create table classes ( 
id SERIAL primary key,
mentor_id INT references mentors(id),
topic VARCHAR(120),
classDate DATE,
classLocation VARCHAR(120));


--8. Insert a few classes in the `classes` table
insert into	classes (mentor_id, topic, classDate, classLocation) values (2, 'GitHub','2021-05-26','Barcelona');
insert into	classes (mentor_id, topic, classDate, classLocation) values (3, 'JavaScript','2021-06-02','Zoom');
insert into	classes (mentor_id, topic, classDate, classLocation) values (4, 'NodeJS','2021-07-13','Glovo Office');
insert into	classes (mentor_id, topic, classDate, classLocation) values (1, 'Databases','2021-09-07','Glasgow');


--9. We now want to store who among the students attends a specific class. How would you store that? Come up with a solution and insert some data if you model this as a new table.s
create table attendance (
id SERIAL primary key,
class_id INT references classes(id),
student_id INT references students(id));

insert into	attendance (class_id, student_id) values (4, 1);
insert into	attendance (class_id, student_id) values (4, 2);
insert into	attendance (class_id, student_id) values (4, 4);
insert into	attendance (class_id, student_id) values (4, 5);
insert into	attendance (class_id, student_id) values (4, 7);
insert into	attendance (class_id, student_id) values (4, 8);
insert into	attendance (class_id, student_id) values (3, 9);
insert into	attendance (class_id, student_id) values (3, 10);
insert into	attendance (class_id, student_id) values (3, 3);
insert into	attendance (class_id, student_id) values (3, 6);
insert into	attendance (class_id, student_id) values (2, 2);
insert into	attendance (class_id, student_id) values (2, 4);
insert into	attendance (class_id, student_id) values (2, 10);
insert into	attendance (class_id, student_id) values (2, 3);
insert into	attendance (class_id, student_id) values (2, 5);
insert into	attendance (class_id, student_id) values (2, 7);
insert into	attendance (class_id, student_id) values (2, 9);
insert into	attendance (class_id, student_id) values (2, 8);
insert into	attendance (class_id, student_id) values (1, 1);
insert into	attendance (class_id, student_id) values (1, 2);
insert into	attendance (class_id, student_id) values (1, 3);
insert into	attendance (class_id, student_id) values (1, 4);
insert into	attendance (class_id, student_id) values (1, 5);



--10. Answer the following questions using a `select` SQL statement:
    -- Retrieve all the mentors who lived more than 5 years in Glasgow
    -- Retrieve all the mentors whose favourite language is Javascript
    -- Retrieve all the students who are CYF graduates
    -- Retrieve all the classes taught before June this year
    -- Retrieve all the students (retrieving student ids only is fine) who attended the Javascript class (or any other class that you have in the `classes` table).
select * from mentors where yearsinglasgow > 5;
select * from mentors where favproglang = 'JavaScript';
select * from students where isgradcyf = true;
select * from classes where classdate < '2021-06-01';
select student_id from attendance where class_id=3;


