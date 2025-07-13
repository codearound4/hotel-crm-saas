CREATE DATABASE IF NOT EXISTS my_hotel;

USE my_hotel;


CREATE TABLE clients (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100),
  phone VARCHAR(20),
  birth_date DATE,
  profession VARCHAR(100),
  address TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE employees (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  role VARCHAR(50), -- função: recepção, limpeza, gerente...
  email VARCHAR(100),
  phone VARCHAR(20),
  hire_date DATE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE rooms (
  id INT PRIMARY KEY AUTO_INCREMENT,
  number VARCHAR(10) NOT NULL,
  type ENUM('single', 'double', 'suite') NOT NULL,
  description TEXT,
  price_per_night DECIMAL(10,2),
  is_available BOOLEAN DEFAULT TRUE
);



CREATE TABLE reservations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  client_id INT,
  room_id INT,
  check_in DATE,
  check_out DATE,
  status ENUM('pendente', 'confirmada', 'cancelada') DEFAULT 'pendente',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES clients(id),
  FOREIGN KEY (room_id) REFERENCES rooms(id)
);

