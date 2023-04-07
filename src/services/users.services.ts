import { ObjectId } from "mongodb";
import { db } from "../database/instance";

export async function getUserById(user_id: string){
  if (ObjectId.isValid(user_id)) {
    await db.collection('users')
      .findOne({_id : new ObjectId(user_id)})
      .then((data) => {
        return {
          'user': data,
          'error': false
        }
      })
      .catch((err) => {
        return {
          'user': false,
          "error" : true
        };
      });
  } else {
    return {
      'user': false,
      'error': true
    };
  }
}
