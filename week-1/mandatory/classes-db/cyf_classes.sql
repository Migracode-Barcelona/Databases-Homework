CREATE TABLE mentors (
	id SERIAL PRIMARY KEY,
	name VARCHAR(30) not null,
	address VARCHAR(30),
	fav_progr_leng VARCHAR(10) not null,
	years_in_glasgow INT 
);
CREATE TABLE students (
	id SERIAL PRIMARY KEY,
	name VARCHAR(30)not null,
	address VARCHAR(30) not null,
	cyf_graduated BOOLEAN
);
CREATE TABLE classes (
	id SERIAL PRIMARY KEY,
	leading_mentor VARCHAR(20) not null,
	topic VARCHAR(20) not null,
	specific_date DATE UNIQUE not null,
	location VARCHAR(30) not null
);
CREATE TABLE classes_assistances (
	student_id INT REFERENCES students(id),
	class_id INT REFERENCES classes(id),
	class_date DATE REFERENCES classes(specific_date)
);
INSERT INTO mentors (name, address, fav_progr_leng, years_in_glasgow) VALUES ('Roberto Siraguza', 'Gral. Cepeda 24', 'Rust', 20);
INSERT INTO mentors (name, address, fav_progr_leng, years_in_glasgow) VALUES ('Alfonso Balmaceda', 'Los apostoles 45', 'Javascript', 10);
INSERT INTO mentors (name, address, fav_progr_leng, years_in_glasgow) VALUES ('Ruben Sanabria', 'Ramon de los palotes 12', 'Python', 21);
INSERT INTO mentors (name, address, fav_progr_leng, years_in_glasgow) VALUES ('Joana sil Vareiro', 'calle Villares 12', 'Python', 7);
INSERT INTO mentors (name, address, fav_progr_leng, years_in_glasgow) VALUES ('Mathilda Moron', 'calle vidrieros 223', 'Html', 4);

INSERT INTO students (name, address, cyf_graduated) VALUES ('Patricio Melanes', 'Ronceda 31', 'true');
INSERT INTO students (name, address, cyf_graduated) VALUES ('Marcelo Cuevas', 'Potosi 34', 'false');
INSERT INTO students (name, address, cyf_graduated) VALUES ('Luca Prodan', 'Alejandro Magno 98 ', 'false');
INSERT INTO students (name, address, cyf_graduated) VALUES ('Antonio Napolitano', 'paseo de Las Bocatas 45', 'false');
INSERT INTO students (name, address, cyf_graduated) VALUES ('Martina Bounasera', 'Av. Libertad 1546', 'true');
INSERT INTO students (name, address, cyf_graduated) VALUES ('Lucas Galan', 'Ramon y cajal 86', 'false');
INSERT INTO students (name, address, cyf_graduated) VALUES ('Monica Gronceda', 'Plaza Espana 3', 'true');
INSERT INTO students (name, address, cyf_graduated) VALUES ('Victoria Pantano', 'San Leopoldo 12', 'false');
INSERT INTO students (name, address, cyf_graduated) VALUES ('Giovana Navas', 'Santic spritius 21', 'true');
INSERT INTO students (name, address, cyf_graduated) VALUES ('Lorenzo Caniete', 'Vitigudino 34', 'true');

INSERT INTO classes (leading_mentor, topic, specific_date, location) VALUES ('Juanita Caceres', 'Node js', '2021-06-19 19:30:00', 'Open Cultural Center');
INSERT INTO classes (leading_mentor, topic, specific_date, location) VALUES ('Juanita Caceres', 'Node js', '2021-06-25 19:30:00', 'Biblioteca del ayuntamiento');
INSERT INTO classes (leading_mentor, topic, specific_date, location) VALUES ('Javier Requena', 'Javascript', '2021-06-30 19:30:00', 'Open Cultural Center');
INSERT INTO classes (leading_mentor, topic, specific_date, location) VALUES ('Ramon Rubiolo', 'Javascript', '2021-07-05 19:30:00', 'Biblioteca publica San Martin');
INSERT INTO classes (leading_mentor, topic, specific_date, location) VALUES ('Juanita Caceres', 'SQL', '2021-07-12 19:30:00', 'Open Cultural Center');

INSERT INTO classes_assistances (student_id, class_id, class_date) VALUES (2, 3, '2021-06-30 19:30:00');
INSERT INTO classes_assistances (student_id, class_id, class_date) VALUES (5, 4, '2021-07-05 19:30:00');
INSERT INTO classes_assistances (student_id, class_id, class_date) VALUES (7, 1, '2021-06-19 19:30:00');

SELECT * FROM mentors WHERE years_in_glasgow > 5;
SELECT * FROM mentors WHERE fav_progr_leng = 'Javascript';
SELECT * FROM students WHERE cyf_graduated is true;
SELECT * FROM classes WHERE specific_date < '2021-06-01 00:01:00';
SELECT student_id, class_id FROM classes_assistances WHERE class_id = 3;
