CREATE DATABASE charityapp;

DROP TABLE IF EXISTS micropayments;

CREATE TABLE micropayments (
	ID SERIAL PRIMARY KEY,
	user_id VARCHAR,
  amount FLOAT,
  timeadded TIMESTAMP
);
