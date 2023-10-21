import { Router} from "express";
import { db } from "../../service/db.js"

const router = Router();
router.get('/', (req, res) => {
    const query = 'SELECT * FROM borrowers';
    db.query(query, (err, result) => {
        if (err) {
            res.status(500).send('Error fetching borrowers');
        } else {
            res.status(201).json(result);
        }
    });
});
router.post('/register', (req, res) => {
    const { name, email } = req.body;
    // Get the current date in a format suitable for MySQL (YYYY-MM-DD)
    const currentDate = new Date().toISOString().split('T')[0];
    // Check if email is duplicated
    const checkDuplicateEmailQuery = 'SELECT id FROM borrowers WHERE email = ?';
    db.query(checkDuplicateEmailQuery, [email], (err, results) => {
        if (err) {
            return res.status(500).send('Error checking email existence');
        }

        if (results.length > 0) {
            return res.status(404).send('Email is already in use');
        }

        const query = 'INSERT INTO borrowers (name, email, registered_date) VALUES (?, ?, ?)';
        db.query(query, [name, email, currentDate], (err, result) => {
            if (err) {
                res.status(500).send('Error creating a borrower');
            } else {
                res.status(201).send('Borrower created');
            }
        });

    });

});
router.put('/:id', (req, res) => {
    const borrowerId = req.params.id;
    const { name, email} = req.body;

    // Check if email is duplicated
    const checkDuplicateEmailQuery = 'SELECT id FROM borrowers WHERE email = ? AND id != ?';
    db.query(checkDuplicateEmailQuery, [email, borrowerId], (err, results)=>{
        if (err) {
            return res.status(500).send('Error checking email duplication');
        }

        if (results.length > 0) {
            return res.status(400).send('Email is already in use');
        }

        const query = 'UPDATE borrowers SET name=?, email=? WHERE id=?';
        db.query(query, [name, email, borrowerId], (err, result) => {
            if (err) {
                res.status(500).send('Error updating the borrower');
            } else {
                res.status(201).send('Borrower updated');
            }
        });
    })


});
router.delete('/:id', (req, res) => {
    const borrowerId = req.params.id;
    // Check if the borrower with the provided ID exists
    const checkExistenceQuery = 'SELECT id FROM borrowers WHERE id = ?';
    db.query(checkExistenceQuery, [borrowerId], (err, results) => {
        if (err) {
            return res.status(500).send('Error checking borrower existence');
        }

        if (results.length === 0) {
            return res.status(404).send('borrower not found');
        }

        const query = 'DELETE FROM borrowers WHERE id=?';
        db.query(query, [borrowerId], (err, result) => {
            if (err) {
                res.status(500).send('Error deleting the borrower');
            } else {
                res.status(201).send('Borrower deleted');
            }
        });
    });

});
router.post('/check-out-book', (req, res) =>{
    const { bookId, borrowerId, endDate} = req.body;
    // Get the current date for startDate
    const startDate = new Date().toISOString().split('T')[0];
    // Set isBorrowed to true
    const isBorrowed = true;
    // Check if the bookId and borrowerId exist
    const checkBookQuery = 'SELECT * FROM books WHERE id = ?';
    const checkBorrowerQuery = 'SELECT id FROM borrowers WHERE id = ?';

    db.query(checkBookQuery, [bookId], (err, bookResult) => {
        if (err) {
            return res.status(500).send('Error checking book existence');
        }

        db.query(checkBorrowerQuery, [borrowerId], (err, borrowerResult) => {
            if (err) {
                return res.status(500).send('Error checking borrower existence');
            }

            if (bookResult.length === 0) {
                return res.status(400).send('Book not found');
            }

            if (borrowerResult.length === 0) {
                return res.status(400).send('Borrower not found');
            }

            if (endDate <= startDate) {
                return res.status(400).send('endDate must be after startDate');
            }

            const bookQuantity = bookResult[0].quantity;
            if(bookQuantity <= 0){
                return res.status(400).send('Book is out of library. Can\'t borrow.');
            }

            const query = 'INSERT INTO book_borrowings (bookId, borrowerId, isBorrowed, startDate, endDate) VALUES (?, ?, ?, ?, ?)';
            db.query(query, [bookId, borrowerId, isBorrowed, startDate, endDate], (err, result) => {
                if (err) {
                    return res.status(500).send('Error creating a book borrowing');
                } else {
                    // Decrement the book's quantity
                    const quantityQuery = 'UPDATE books SET quantity = quantity - 1 WHERE id = ?';
                    db.query(quantityQuery,[bookId],(err,quantityResult)=>{
                        if (err) {
                            return res.status(500).send('Error updating book quantity');
                        }
                        return res.status(201).send('Book borrowing created');
                    })
                   
                }
            });
        });
    });

});

router.post('/return-book', (req, res)=>{
    const { bookId, borrowerId} = req.body;

    // Check if the bookId and borrowerId exist
    const checkBookAndBorrowerQuery = 'SELECT id FROM book_borrowings WHERE bookId =? AND borrowerId =? AND isBorrowed =?';

    db.query(checkBookAndBorrowerQuery, [bookId, borrowerId, true], (err, BookAndBorrowerResult) => {
        if (err) {
            return res.status(500).send('Error BookAndBorrower existence');
        }
        
        if (BookAndBorrowerResult.length === 0) {
            return res.status(400).send('BookAndBorrower not found');
        }

        const query = 'UPDATE book_borrowings SET isBorrowed = ? WHERE bookId = ? AND borrowerId = ?';
        db.query(query,[false, bookId, borrowerId], (err, result)=>{
            if (err) {
                res.status(500).send('Error updating the Book Borrowering');
            } else {
                // Increment the book's quantity
                const quantityQuery = 'UPDATE books SET quantity = quantity + 1 WHERE id = ?';
                db.query(quantityQuery,[bookId],(err,quantityResult)=>{
                    if (err) {
                        return res.status(500).send('Error updating book quantity');
                    }
                    return res.status(201).send('the Book Borrowering is returned');
                })
                
            }
        } )
    });
})

// Get all check books they currently have.
router.get('/get-borrowed-books/:id',(req, res) =>{
    const borrowerId = req.params.id;
    const isBorrowed = true
    // Check if the borrowerId exist
    const checkBorrowerQuery = 'SELECT id FROM borrowers WHERE id = ?';
    db.query(checkBorrowerQuery, [borrowerId], (err, borrowerResult) =>{
        if (err) {
            return res.status(500).send('Error checking borrower existence');
        }
        if (borrowerResult.length === 0) {
            return res.status(400).send('Borrower not found');
        }
        const query = 'SELECT * FROM book_borrowings WHERE borrowerId = ? AND isBorrowed = ?';
        db.query(query,[borrowerId, isBorrowed], (err, result) =>{
            if (err) {
                res.status(500).send('Error get check the Book Borrowering');
            } else {
                res.status(201).json(result);
            }
        })

    })
})

export default router;