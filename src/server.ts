import express, { Application } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

require('dotenv').config();

const port = process.env.SERVER_PORT;
const app: Application = express();

app.use(cookieParser());
app.use(cors({
  origin: `http://localhost:${process.env.CLIENT_PORT}`,
  credentials: true,
}))

app.use(express.json());

// routes here


app.listen(port, () => {
  console.log(`Your API is now listening on port ${port}`);
});  
