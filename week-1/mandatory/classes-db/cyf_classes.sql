drop table if exists roster;
drop table if exists classes;
DROP TABLE IF EXISTS mentors;
drop table if exists students;

----2. Create a new table `mentors`, for each mentor we want to save their name, how many years they lived in Glasgow, their address and their favourite programming language.
create table mentors (
id			SERIAL primary key,
name		VARCHAR(30) NOT NULL,
years		INT,
address		VARCHAR(30),
lan			VARCHAR(30)
);
----3. Insert 5 mentors in the `mentors` table (you can make up the data, it doesn't need to be accurate ;-)).
INSERT INTO mentors (name, years, address, lan) values ('Ali Ashraf', 2, '203 Lakewood Dr.', 'SQL');
INSERT INTO mentors (name, years, address, lan) values ('Brian Barns', 3, '364 Sherman Lane', 'Python');
INSERT INTO mentors (name, years, address, lan) values ('Cameron Crane', 4, '4857 Samnson St.', 'Javascript');
INSERT INTO mentors (name, years, address, lan) values ('David Drake', 5, '51 Hammond Dr.', 'HTML/CSS');
INSERT INTO mentors (name, years, address, lan) values ('Erin Evert', 6, '622 Old Country Rd.', 'Javascript');


----4. Create a new table `students`, for each student we want to save their name, address and if they have graduated from Code Your Future.
create table students (
id			SERIAL primary key,
name		VARCHAR (30) not null,
address		VARCHAR (30),
graduated	boolean
);


----5. Insert 10 students in the `students` table.
insert into students (name, address, graduated) values ('Sam Smith', '80 Crotch Crescent', true);
insert into students (name, address, graduated) values ('Pam Pith', '2 This St.', false);
insert into students (name, address, graduated) values ('Tam Tith', '4 The Other St.', true);
insert into students (name, address, graduated) values ('Ham Hith', '16 Grope Lane', false);
insert into students (name, address, graduated) values ('Yam Yith', '101 Ha-Ha Rd.', true);
insert into students (name, address, graduated) values ('Jam Jith', '69 Man Fuk Rd.', false);
insert into students (name, address, graduated) values ('Lam Lith', '73 Squeeze Guts Alley', true);
insert into students (name, address, graduated) values ('Mam Mith', '544 Chicken Dinner Rd..', false);
insert into students (name, address, graduated) values ('Ram Rith', '8384 Butt St.', true);
insert into students (name, address, graduated) values ('Vam Vith', '913 Why Worry Ln.', false);

----6. Verify that the data you created for mentors and students are correctly stored in their respective tables (hint: use a `select` SQL statement).
select * from mentors;
select * from students;
select address from students;


----7. Create a new `classes` table to record the following information:
   ---- A class has a leading mentor
   ---- A class has a topic (such as Javascript, NodeJS)
   ---- A class is taught at a specific date and at a specific location
create table classes (
id				SERIAL primary key,
leading_mentor	VARCHAR (30) not null,
topic			VARCHAR (30),
date			DATE,
location		VARCHAR (30)
);


----8. Insert a few classes in the `classes` table
insert into classes (leading_mentor, topic, date, location) values ('George', 'Javascript', '2021-08-21', 'Room 5');
insert into classes (leading_mentor, topic, date, location) values ('Ginnie', 'NodeJS', '2021-08-20', 'Room 3');
insert into classes (leading_mentor, topic, date, location) values ('Gary', 'HTML/CSS', '2021-08-21', 'Room 7');
insert into classes (leading_mentor, topic, date, location) values ('Gordon', 'Javascript', '2021-08-22', 'Room 2');
insert into classes (leading_mentor, topic, date, location) values ('Geraldine', 'SQL', '2021-08-23', 'Room 1');
insert into classes (leading_mentor, topic, date, location) values ('Gwendolyn', 'Python', '2021-08-22', 'Room 4');
insert into classes (leading_mentor, topic, date, location) values ('Garett', 'NodeJS', '2021-08-21', 'Room 6');
insert into classes (leading_mentor, topic, date, location) values ('Grant', 'HTML/CSS', '2021-05-03', 'Room 2');

----9. We now want to store who among the students attends a specific class. How would you store that? Come up with a solution and insert some data if you model this as a new table.
create table roster (
id		SERIAL primary key,
student_id	INT references students(id),
class_id	INT references classes(id)
);

insert into roster (student_id, class_id) values (1, 6);
insert into roster (student_id, class_id) values (2, 3);
insert into roster (student_id, class_id) values (3, 7);
insert into roster (student_id, class_id) values (4, 2);
insert into roster (student_id, class_id) values (5, 1);
insert into roster (student_id, class_id) values (6, 4);
insert into roster (student_id, class_id) values (7, 5);
insert into roster (student_id, class_id) values (8, 3);
insert into roster (student_id, class_id) values (9, 2);
insert into roster (student_id, class_id) values (10, 7);



----10. Answer the following questions using a `select` SQL statement:
    ---- Retrieve all the mentors who lived more than 5 years in Glasgow
select name, years from mentors where years > 5;
    ---- Retrieve all the mentors whose favourite language is Javascript
select name from mentors where lan = 'Javascript';

    ---- Retrieve all the students who are CYF graduates
select name, graduated from students where graduated;

    ---- Retrieve all the classes taught before June this year
select leading_mentor, topic from classes where date < '2021-06-01';
    ---- Retrieve all the students (retrieving student ids only is fine) who attended the Javascript class (or any other class that you have in the `classes` table).
select id from classes where topic = 'Javascript';
select student_id from roster where class_id =1 or class_id =4;
--Using inner join to do it in one query
select s."name", s.id, c.topic, c.id from students s 
inner join roster r on s.id = r.student_id 
inner join classes c on c.id = r.class_id
where c.topic='Javascript';
