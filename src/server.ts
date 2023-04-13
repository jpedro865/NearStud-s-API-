import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import UserRouter from './routes/users.route';

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
}));

// teeling express to use json
app.use(express.json());


// routes here
app.use('/users', UserRouter);

app.get('/', ( req: Request, res: Response) => {
  res.status(200).json({
    "this": "NearStud's APi",
    "Welcome": true
  })
});

app.listen(port, () => {
  console.log(`Your API is now listening on port ${port}`);
});
