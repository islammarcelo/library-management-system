import { Router} from "express";
import { db } from "../../service/db.js";

const router = Router();

//The system track of which books are checked out and by whom.
router.get('/get-all-books-checked',(req, res) =>{
    const selectDetailsQuery = `SELECT books.id AS bookId, books.title, books.author, books.isbn, books.quantity, books.shelf_location,
        borrowers.id AS borrowerId, borrowers.name AS borrower_name, borrowers.email
        FROM book_borrowings INNER JOIN books ON book_borrowings.bookId = books.id
        INNER JOIN borrowers ON book_borrowings.borrowerId = borrowers.id`;

    db.query(selectDetailsQuery,(err,result)=>{
        if(err){
            res.status(500).send(err.message);
        }else{
            res.status(201).json(result);
        }
    })
})

//Get all books are overdue
router.get('/get-books-overdue',(req, res) =>{
    const currentDate = new Date().toISOString().split('T')[0];
    const selectDetailsQuery = `SELECT books.id AS bookId, books.title, books.author, books.isbn, books.quantity, books.shelf_location,
    borrowers.id AS borrowerId, borrowers.name AS borrower_name, borrowers.email
    FROM book_borrowings INNER JOIN books ON book_borrowings.bookId = books.id
    INNER JOIN borrowers ON book_borrowings.borrowerId = borrowers.id WHERE endDate < ? AND isBorrowed = ?`;

    db.query(selectDetailsQuery, [currentDate, true], (err, result) =>{
        if(err){
            res.status(500).send('Error get books overdue');
        }else{
            res.status(201).json(result);
        }
    })
})
export default router;