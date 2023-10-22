USE library;
CREATE TABLE books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    isbn VARCHAR(13) NOT NULL,
    quantity INT NOT NULL,
    shelf_location VARCHAR(255) NOT NULL,
	INDEX idx_title (title),
    INDEX idx_author (author),
    INDEX idx_isbn (isbn)
);

CREATE TABLE borrowers (
	id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    registered_date DATE NOT NULL
);

CREATE TABLE book_borrowings (
	id INT AUTO_INCREMENT PRIMARY KEY,
	bookId INT,
    borrowerId INT,
    isBorrowed BOOLEAN,
    startDate DATE,
    endDate DATE,
    FOREIGN KEY (bookId) REFERENCES books(id),
    FOREIGN KEY (borrowerId) REFERENCES borrowers(id)
);
