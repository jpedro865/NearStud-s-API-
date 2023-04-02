import { db } from "../database/instance";
import jsonwebtoken from 'jsonwebtoken';

require('dotenv').config();

export async function addVerifToken(user_id: string) {
  const token = jsonwebtoken.sign({
      _id: user_id,
    }, process.env.SECRET_KEY,{
      expiresIn: 1800,
    }
  );

  await db.collection('tokens')
    .insertOne({
      user_id,
      token,
      used: false
    })
    .then( () => {
      return true
    })
    .catch( () => {
      return false
    })
}
