import mysql from "mysql2";

// Create a MySQL database connection
export const db = mysql.createConnection({
    host: 'localhost',
    database: 'library',
    user: 'root',
    password: '12345'
});

// Connect to the database
export const connectToDatabase =()=>{
    db.connect((err) => {
        if (err) {
            console.error('error connecting: ' + err.stack);
            return;
        }
        console.log('Connected to MySQL database');
    });
}

