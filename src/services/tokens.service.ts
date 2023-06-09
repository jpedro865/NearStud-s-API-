import { db } from "../database/instance";
import jsonwebtoken from 'jsonwebtoken';
import { ObjectId } from "mongodb";

require('dotenv').config();

export async function addVerifToken(user_id: string) {
  const hasToken = await db.collection('tokens').findOne({user_id});
  const token = jsonwebtoken.sign({
      _id: user_id,
    }, process.env.KEY_TOKEN,{
      expiresIn: 1800,
    }
  );
  
  if (hasToken) {
    if (!hasToken.used){
      await db.collection('tokens').updateOne({_id: hasToken._id}, {$set: {token, used: false}})
    }
  } else {
    
    return await db.collection('tokens')
      .insertOne({
        user_id,
        token,
        used: false
      })
  }
}

export async function getTokenFromId(token_id: string) {
  const token = await db.collection('tokens').findOne({_id: new ObjectId(token_id)});
  return token.token;
}

export async function findByUserId(user_id: string) {
  const token = await db.collection('tokens').findOne({user_id});
  return token;
}

export async function setUsedToken(token_id: string) {
  const update = await db.collection('tokens').updateOne({_id: new ObjectId(token_id)}, {$set: {used: true}});
  return update;
}
