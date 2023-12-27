CREATE TABLE books(
	id SERIAL PRIMARY KEY,
	book_name VARCHAR(100),
	user_id INTEGER REFERENCES members(id)
);

CREATE TABLE members(
    id SERIAL PRIMARY KEY,
    name VARCHAR(30),
    color VARCHAR(30)
);

INSERT INTO members(name, color)
VALUES ('Mandela', 'blue');

INSERT INTO books(book_name, user_id)
VALUES ('Hunger Game', 1);