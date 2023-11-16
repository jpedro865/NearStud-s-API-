import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import UserRouter from './routes/users.route';
import restoRouter from './routes/resto.route';
import env_vars from './utils/environment';

// init app/middleware
const port = env_vars.SERVER_PORT;
const app: Application = express();

// cookie Parser setup
app.use(cookieParser());

// Cors setup
app.use(cors({
  origin: `*`,
  credentials: true,
}));

// teeling express to use json
app.use(express.json());


// routers here
app.use('/users', UserRouter);
app.use('/restos', restoRouter)

app.get('/', ( req: Request, res: Response) => {
  res.status(200).json({
    "this": "NearStud's APi",
    "Welcome": true
  })
});

app.listen(port, () => {
  console.log(`Your API is now listening on port ${port}`);
});
