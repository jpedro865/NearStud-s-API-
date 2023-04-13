import { Request, Response } from "express";
import jsonwebtoken from 'jsonwebtoken';
import { findByUserId, setUsedToken } from "../services/tokens.service";
import { verifyUser } from "../services/users.services";


export async function valid_email_token(req: Request, res: Response) {
  const token = req.params.token
  jsonwebtoken.verify(token, process.env.KEY_TOKEN, async (err: any, data: any) => {
    if (err) {
      res.status(403).json({
        'Email verification': {
          'message': "There was an error in the email verification."
        }
      });
    } else {
      const token = await findByUserId(data._id)
      if (token && !token.used) {
        await setUsedToken(token._id.toString());
        const verified = await verifyUser(token.user_id);
        if (verified) {
          res.status(200).json({
            'Email verification': {
              'message': "Your Email has been verified !!!!"
            }
          });
        } else {
          res.status(403).json({
            'Email verification': {
              'message': "There was an error in the email verification."
            }
          });
        }
      } else {
        res.status(403).json({
          'Email verification': {
            'message': "There was an error in the email verification."
          }
        });
      }   
    }
  });
}
