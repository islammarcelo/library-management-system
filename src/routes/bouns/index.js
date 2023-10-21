import { Router } from "express";
import { db } from "../../service/db.js";
import {createObjectCsvWriter}  from "csv-writer";
import { subMonths, format } from 'date-fns';

const router = Router();

router.get('/export_book_borrowings_csv', (req, res) => {
    const { startDate, endDate } = req.query;
  
    // Ensure startDate and endDate are provided in the query parameters
    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'Start date and end date are required' });
    }
  
    const selectQuery = 'SELECT * FROM book_borrowings WHERE startDate >= ? AND endDate <= ?';
    db.query(selectQuery, [startDate, endDate], (err, results) => {
      if (err) {
        res.status(500).json({ error: 'Error fetching book borrowings' });
      } else {
        // Create a CSV writer and write the data to a CSV file
        const csvWriter = createObjectCsvWriter({
          path: 'book_borrowings.csv',
          header: [
            { id: 'id', title: 'ID' },
            { id: 'bookId', title: 'Book ID' },
            { id: 'borrowerId', title: 'Borrower ID' },
            { id: 'isBorrowed', title: 'Is Borrowed' },
            { id: 'startDate', title: 'Start Date' },
            { id: 'endDate', title: 'End Date' },
          ],
        });
  
        csvWriter.writeRecords(results)
          .then(() => {
            res.download('book_borrowings.csv', 'book_borrowings.csv');
          })
          .catch((csvErr) => {
            console.error('Error writing CSV:', csvErr);
            res.status(500).json({ error: 'Error exporting book borrowings to CSV' });
          });
      }
    });
  });

  router.get('/export_last_month_book_borrowings_csv', (req, res) => {
    // Calculate the start date and end date for the last month
    const currentDate = new Date();
    const lastMonthStartDate = subMonths(currentDate, 1); // Subtract 1 month from the current date
    const lastMonthEndDate = currentDate;
  
    const startDateString = format(lastMonthStartDate, 'yyyy-MM-dd');
    const endDateString = format(lastMonthEndDate, 'yyyy-MM-dd');

    const selectQuery = 'SELECT * FROM book_borrowings WHERE startDate >= ? AND endDate <= ?';
    db.query(selectQuery, [startDateString, endDateString], (err, results) => {
      if (err) {
        console.error('Error fetching book borrowings:', err);
        res.status(500).json({ error: 'Error fetching book borrowings' });
      } else {
        // Create a CSV writer and write the data to a CSV file
        const csvWriter = createObjectCsvWriter({
          path: 'last_month_book_borrowings.csv',
          header: [
            { id: 'id', title: 'ID' },
            { id: 'bookId', title: 'Book ID' },
            { id: 'borrowerId', title: 'Borrower ID' },
            { id: 'isBorrowed', title: 'Is Borrowed' },
            { id: 'startDate', title: 'Start Date' },
            { id: 'endDate', title: 'End Date' },
          ],
        });
  
        csvWriter.writeRecords(results)
          .then(() => {
            res.download('last_month_book_borrowings.csv', 'last_month_book_borrowings.csv');
          })
          .catch((csvErr) => {
            console.error('Error writing CSV:', csvErr);
            res.status(500).json({ error: 'Error exporting book borrowings to CSV' });
          });
      }
    });
  });

  router.get('/export_last_month_overdue_book_borrowings_csv', (req, res) => {
    // Calculate the start date and end date for the last month
    const currentDate = new Date();
    const lastMonthStartDate = subMonths(currentDate, 1); // Subtract 1 month from the current date
    const lastMonthEndDate = currentDate;
  
    const startDateString = format(lastMonthStartDate, 'yyyy-MM-dd');
    const endDateString = format(lastMonthEndDate, 'yyyy-MM-dd');
    
    const selectQuery = 'SELECT * FROM book_borrowings WHERE startDate >= ? AND endDate <= ? AND isBorrowed = ?';
    db.query(selectQuery, [startDateString, endDateString, true], (err, results) => {
      if (err) {
        console.error('Error fetching book borrowings:', err);
        res.status(500).json({ error: 'Error fetching book borrowings' });
      } else {
        // Create a CSV writer and write the data to a CSV file
        const csvWriter = createObjectCsvWriter({
          path: 'last_month_overdue_book_borrowings.csv',
          header: [
            { id: 'id', title: 'ID' },
            { id: 'bookId', title: 'Book ID' },
            { id: 'borrowerId', title: 'Borrower ID' },
            { id: 'isBorrowed', title: 'Is Borrowed' },
            { id: 'startDate', title: 'Start Date' },
            { id: 'endDate', title: 'End Date' },
          ],
        });
  
        csvWriter.writeRecords(results)
          .then(() => {
            res.download('last_month_overdue_book_borrowings.csv', 'last_month_overdue_book_borrowings.csv');
          })
          .catch((csvErr) => {
            console.error('Error writing CSV:', csvErr);
            res.status(500).json({ error: 'Error exporting book borrowings to CSV' });
          });
      }
    });
  });

  export default router;

