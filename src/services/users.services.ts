import { ObjectId } from "mongodb";
import { db } from "../database/instance";

export async function getUserById(user_id: string){
  const user = await db.collection('user').findOne({_id: new ObjectId(user_id)});
  return user
}

export async function verifyUser(user_id: string){
  const update = await db.collection('users').updateOne({_id: new ObjectId(user_id)}, {$set: {verified: true}});
  return update.acknowledged;
}
