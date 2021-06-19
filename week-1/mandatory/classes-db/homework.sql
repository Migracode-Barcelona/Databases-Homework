drop table if exists attendance;
drop table if exists classes;
drop table if exists mentors;
drop table if exists students;

create table mentors ( 
id SERIAL primary key,
mentorName VARCHAR(30) not null,
yearsInGlasgow INT,
address VARCHAR(120),
favProgLang VARCHAR(30) );

insert	into mentors (mentorName,	yearsinglasgow,	address, favproglang) values ('John Smith',5,'C/ Carders 32','Java');
insert	into mentors (mentorName,	yearsinglasgow,	address, favproglang) values ('Lilac Lane',2,'2197 Prospect Valley Road','JavaScript');
insert	into mentors (mentorName,	yearsinglasgow,	address, favproglang) values ('Sarah Harris',6,'96 Thames Street','Swift');
insert	into mentors (mentorName,	yearsinglasgow,	address, favproglang) values ('Thomas Keough',1,'92 Academy Street','JavaScript');
insert	into mentors (mentorName,	yearsinglasgow,	address, favproglang) values ('Betty W. Mitchell',1,'75 Freezeland Lane','Swift');

create table students ( 
id SERIAL primary key,
studentName VARCHAR(30) not null,
address VARCHAR(120),
isGradCYF BOOLEAN not null);

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

select * from mentors;
select * from students;

create table classes ( 
id SERIAL primary key,
mentor_id INT references mentors(id),
topic VARCHAR(120),
classDate DATE,
classLocation VARCHAR(120));

insert into	classes (mentor_id, topic, classDate, classLocation) values (2, 'GitHub','2021-05-26','Barcelona');
insert into	classes (mentor_id, topic, classDate, classLocation) values (3, 'JavaScript','2021-06-02','Zoom');
insert into	classes (mentor_id, topic, classDate, classLocation) values (4, 'NodeJS','2021-07-13','Glovo Office');
insert into	classes (mentor_id, topic, classDate, classLocation) values (1, 'Databases','2021-09-07','Glasgow');

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

select * from mentors where yearsinglasgow > 5;
select * from mentors where favproglang = 'JavaScript';
select * from students where isgradcyf = true;
select * from classes where classdate < '2021-06-01';
select student_id from attendance where class_id=3;


