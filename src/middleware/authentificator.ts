// Importing Request, Response and NextFuction from express dependencie
import { Request, Response, NextFunction } from 'express';
import jsonwebtoken from 'jsonwebtoken';

require('dotenv').config(); // Calling .env file

export function auth(req: Request, res: Response, next: NextFunction) {
  // recovery of the token in header without the bearer
  const token = req.cookies.access_token;
  // verification of the existence of the token
  if (!token) {
    res.status(403).json({
      message: 'No token found',
    });
  } else {
    // verification of the validity of the token thanks to the public key
    jsonwebtoken.verify(token, process.env.SECRET_KEY, (err: any, data: any) => {
      if (err) {
        res.status(403).json({
          message: `Desole, une erreur est survenu: ${err}`,
        });
      } else {
        req.body.data = data;
        next();
      }
    });
  }

}
