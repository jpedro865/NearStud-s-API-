import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcrypt';
import { UserValidator } from '../validator/users.validator';
import { db } from '../database/instance';



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

  req.body.pwd = crypt_pwd(req.body.pwd);
  
  const validator: UserValidator = new UserValidator();
  await validator.validateUserCreation(req);
  
  // inserting the user in the db if the data was validated
  if (validator.isValid()) {
    await db.collection('users')
    .insertOne(req.body)
    .then( data => {
      res.status(201).json(data);
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

function crypt_pwd(pwd: string) {
  bcrypt.hash(pwd, 25, function(err, hash) {
    return hash;
  });
}

function compare_hash(pwd: string, hash: string) {
  bcrypt.compare(pwd, hash, function(err, result) {
    return result;
  });
}
