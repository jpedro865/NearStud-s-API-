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
    const updated = await db.collection('tokens').updateOne({_id: hasToken._id}, {$set: {token, used: false}});
    if (updated.acknowledged) {
      return {
        acknowledged: updated.acknowledged,
        token_id: hasToken._id
      };
    }
  } else {
    const inserted =  await db.collection('tokens')
      .insertOne({
        user_id,
        token,
        used: false
      })
    if (inserted.acknowledged) {
      return {
        acknowledged: inserted.acknowledged,
        token_id: inserted.insertedId
      };
    }
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
