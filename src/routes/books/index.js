import { Router} from "express";
import { db } from "../../service/db.js";

const router = Router();

router.get('/', (req, res)=>{
    const query = 'SELECT * FROM books';
    db.query(query, (err, result)=>{
        if(err){
            res.status(500).send('Error fetching books');
        }
        res.status(201).json(result);
    })
})

router.post("/create-book",(req,res)=>{
    const { title, author, isbn, quantity, shelf_location } = req.body;
    if (quantity < 0) {
        return res.status(400).send('Quantity cannot be negative');
    }
     // Check if ISBN is duplicated
     const checkDuplicateISBNQuery = 'SELECT id FROM books WHERE isbn = ?';
     db.query(checkDuplicateISBNQuery, [isbn], (err, results)=>{
         if (err) {
             return res.status(500).send('Error checking ISBN duplication');
         }
 
         if (results.length > 0) {
             return res.status(400).send('ISBN is already in use');
         }
         const query = 'INSERT INTO books (title, author, isbn, quantity, shelf_location) VALUES (?, ?, ?, ?, ?)';
         db.query(query, [title, author, isbn, quantity, shelf_location], (err, result) => {
             if (err) {
                 res.status(500).send('Error creating a book');
             }
             res.status(201).send('Book created');
         });
    });

})
router.put('/:id', (req, res) => {
    const bookId = req.params.id;
    const {title, author, isbn, quantity, shelf_location} = req.body;

    if (quantity < 0) {
        return res.status(400).send('Quantity cannot be negative');
    }

    // Check if ISBN is duplicated
    const checkDuplicateISBNQuery = 'SELECT id FROM books WHERE isbn = ? AND id != ?';
    db.query(checkDuplicateISBNQuery, [isbn, bookId], (err, results)=>{
        if (err) {
            return res.status(500).send('Error checking ISBN duplication');
        }

        if (results.length > 0) {
            return res.status(400).send('ISBN is already in use');
        }

        const updateQuery = 'UPDATE books SET title=?, author=?, isbn=?, quantity=?, shelf_location=? WHERE id=?';
        db.query(updateQuery, [title, author, isbn, quantity, shelf_location, bookId], (err, result) => {
            if (err) {
                return res.status(500).send('Error updating the book');
            }
            res.status(201).send('Book updated');
        });
    })
})

router.delete('/:id',(req, res)=>{
    const bookId = req.params.id;
    // Check if the book with the provided ID exists
    const checkExistenceQuery = 'SELECT id FROM books WHERE id = ?';
    db.query(checkExistenceQuery, [bookId], (err, results) => {
        if (err) {
            return res.status(500).send('Error checking book existence');
        }

        if (results.length === 0) {
            return res.status(404).send('Book not found');
        }

        const deleteQuery = 'DELETE FROM books WHERE id = ?';
        db.query(deleteQuery, [bookId], (err, result) => {
            if (err) {
                return res.status(500).send('Error deleting the book');
            }
            res.status(201).send('Book deleted');
        });
    });
})

router.get('/search-books',(req, res)=>{
    const { query } = req.query;
    const searchQuery = `SELECT * FROM books WHERE title LIKE ? OR author LIKE ? OR isbn LIKE ?`;
    const searchValue = `%${query}%`;
    db.query(searchQuery, [searchValue, searchValue, searchValue], (err, results) =>{
        if (err) {
            return res.status(500).send('Error searching for books');
        }
        if (results.length === 0) {
            return res.status(404).send('No books found matching the search criteria');
        }
        res.status(201).json(results);
    })
})

export default router;