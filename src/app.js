import express from "express";
import bodyParser from "body-parser";
import basicAuth from "basic-auth";
import {connectToDatabase, db } from "./service/db.js";
import booksRouter from "./routes/books/index.js";
import borrowersRouter from "./routes/borrowers/index.js";
import systemRouter from "./routes/system/index.js";
import bounsRouter from "./routes/bouns/index.js";
import rateLimit from "express-rate-limit";

const app = express();
const port = 5000;
app.use(bodyParser.json());
connectToDatabase();

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Add a middleware for basic authentication
app.use((req, res, next) => {
    const credentials = basicAuth(req);
    const validUsername = 'islam'; // Replace with your actual username
    const validPassword = 'islam'; // Replace with your actual password
  
    if (!credentials || credentials.name !== validUsername || credentials.pass !== validPassword) {
      res.status(401).send('Unauthorized');
    } else {
      next();
    }
  });

  app.use('/bouns', rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 1, //1 requests per hour
    message: 'You have exceeded the rate limit for this endpoint.',
  }));
  
  app.use("/books",booksRouter);
  app.use("/borrowers",borrowersRouter);
  app.use("/system",systemRouter);
  app.use("/bouns",bounsRouter);

export default app;