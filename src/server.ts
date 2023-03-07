import express, { Application } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

require('dotenv').config();

// init app/middleware
const port = process.env.SERVER_PORT;
const app: Application = express();

// cookie Parser setup
app.use(cookieParser());

// Cors setup
app.use(cors({
  origin: `http://localhost:${process.env.CLIENT_PORT}`,
  credentials: true,
}))

// teeling express to use json
app.use(express.json());


// routes here



app.listen(port, () => {
      console.log(`Your API is now listening on port ${port}`);
    });
