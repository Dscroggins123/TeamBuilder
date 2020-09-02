CREATE DATABASE 'Team_DB';

USE 'Team_DB';


CREATE TABLE department(
id INT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(15)
     
);




CREATE TABLE role (
id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(15),
    salary INT(15),
    department_id INT(10),
   CONSTRAINT fk_department FOREIGN KEY(department_id) REFERENCES department(id) ON DELETE CASCADE
);



CREATE TABLE employee (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(15),
    last_name VARCHAR(15),
    role_id INT(10),
    manager_id INT(10),
    CONSTRAINT fk_role FOREIGN KEY(role_id) REFERENCES role(id) ON DELETE CASCADE,
    CONSTRAINT fk_manager FOREIGN KEY(manager_id) REFERENCES employee(id) ON DELETE SET NULL
);


