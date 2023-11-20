-- schema.sql

CREATE TABLE IF NOT EXISTS visits (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  surname VARCHAR(255),
  phone_number VARCHAR(255),
  SSN VARCHAR(255),
  day DATE,
  time TIME
);

CREATE TABLE IF NOT EXISTS doctors (
  id SERIAL PRIMARY KEY,
  surname VARCHAR(255),
  name VARCHAR(255),
  specialization VARCHAR(255)
);
