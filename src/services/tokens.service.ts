import { db } from "../database/instance";
import jsonwebtoken from 'jsonwebtoken';
import { ObjectId } from "mongodb";

require('dotenv').config();

/** *********************************  Emails tokens ************************************* */

/**
 * addVerifToken
 * 
 * ajoute un token de verification pour l'utilisateur
 * 
 * @param user_id 
 * @returns result of the insert
 */
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

/**
 * getTokenFromId
 * 
 * trouve le token en fonction de son id
 * 
 * @param token_id 
 * @returns token
 */
export async function getTokenFromId(token_id: string) {
  const token = await db.collection('tokens').findOne({_id: new ObjectId(token_id)});
  return token.token;
}

/**
 * findByUserId
 * 
 * trouve le token en fonction de l'id de l'utilisateur
 * 
 * @param user_id 
 * @returns token
 */
export async function findByUserId(user_id: string) {
  const token = await db.collection('tokens').findOne({user_id});
  return token;
}

/**
 * setUsedToken
 * 
 * rend le token utilisé
 * 
 * @param token_id 
 * @returns result of the update
 */
export async function setUsedToken(token_id: string) {
  const update = await db.collection('tokens').updateOne({_id: new ObjectId(token_id)}, {$set: {used: true}});
  return update;
}


/** *********************************  Refresh Tokens ************************************* */

/**
 * addRefreshToken
 * 
 * ajoute un token de rafraichissement pour l'utilisateur
= * 
 * @param user_id 
 * @returns result of the insert
 */
export async function addRefreshToken(user_id: string, token: string): Promise<boolean> {
  const hasToken = await db.collection('refresh_tokens').findOne({user_id});

  if (hasToken) {
    const updated = await db.collection('refresh_tokens').updateOne({_id: hasToken._id}, {$set: {token, modified_at: new Date()}});
    if (updated.acknowledged) {
      return true
    }
    return false;
  } else {
    const inserted = await db.collection('refresh_tokens')
      .insertOne({
        user_id,
        token,
        modified_at: new Date(),
      })
    if (inserted.acknowledged) {
      return true;
    }
    return false;
  }
}

/**
 * verifyRefreshToken
 * 
 * verifie que le token de rafraichissement est valide
 * 
 * @param token_id 
 * @returns token
 */
export async function verifyRefreshToken(user_id: string, token: string): Promise<boolean> {
  const tokenInDB = await db.collection('refresh_tokens').findOne({user_id});
  return token === tokenInDB.token;
}