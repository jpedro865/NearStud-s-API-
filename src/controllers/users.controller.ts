import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcrypt';
import { UserValidator } from '../validator/users.validator';
import { db } from '../database/instance';
import { email_verif_send } from '../services/emailer.services';
import { log } from 'console';

/**
 * Controller pour rechercher tous les utilisateurs
 * 
 * @param req 
 * @param res 
 */
export async function getAll(req: Request, res: Response) {
  await db.collection('users')
    .find()
    .toArray()
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(500).json({
        "Server_Error" : err
      })
    });
}

/**
 * Controller pour rechercher un utilisateur par son Identifiant
 * 
 * @param req 
 * @param res 
 */
export async function getById(req: Request, res: Response) {
  if (ObjectId.isValid(req.params.id)) {
    await db.collection('users')
      .findOne({_id : new ObjectId(req.params.id)})
      .then((data) => {
        res.status(200).json(data);
      })
      .catch((err) => {
        res.status(500).json({
          "Server_Error" : err
        });
      });
  } else {
    res.status(500).json({
      'error': 'Not a valid ObjectId document'
    });
  }
}

/**
 * Controller de creation d'un nouveau utilisateur
 * 
 * @param req 
 * @param res 
 */
export async function createUser(req: Request, res: Response) {
  
  const validator: UserValidator = new UserValidator();
  await validator.validateUserCreation(req);

  req.body.pwd = await crypt_pwd(req.body.pwd);
  // inserting the user in the db if the data was validated
  if (validator.isValid()) {
    await db.collection('users')
    .insertOne(req.body)
    .then( async (data) => {
      const user_id = data.insertedId.toString();
      res.status(201).json(data);
      const send = false
      // const send = await email_verif_send(user_id);
      if(send) {
        console.log('email sent');
      } else {
        console.log('email not sent');
      }
    })
    .catch( error => {
      res.status(500).json(error);
    });
  } else {
    res.status(400).json({
      'error_list': validator.getErrors()
    });
  }
}

/**
 * Cryptage du mot-de-passe
 * 
 * @param pwd 
 * @returns string
 */
async function crypt_pwd(pwd: string) {
  const hash = await bcrypt.hash(pwd, 8);
  return hash
}

/**
 * Compare hashed mdp et mdp string
 * 
 * @param pwd 
 * @param hash 
 * @returns boolean
 */
async function compare_hash(pwd: string, hash: string) {
  const result = await bcrypt.compare(pwd, hash);
  return result
}
