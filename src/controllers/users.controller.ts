import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcrypt';
import { UserValidator } from '../validator/users.validator';
import { db } from '../database/instance';
import jsonwebtoken from 'jsonwebtoken';
import { Mailer } from '../services/Mailer';

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
      const mailer = new Mailer();
      await mailer.email_verif_send(user_id, req.body.email);
      res.status(201).json(data);
    })
    .catch( error => {
      console.log(error);
      res.status(500).json(error);
    });
  } else {
    res.status(400).json({
      'error_list': validator.getErrors()
    });
  }
}

/**
 * Controller pour connecter un User
 * 
 * @param req 
 * @param res 
 */
export async function connect_user(req: Request, res: Response) {
  const identifier = req.body.identifier;

  // verification si identifier existe
  const username = await db.collection('users').findOne({username: identifier})
  const email = await db.collection('users').findOne({email: identifier})
  let user;

  if (username) {
    user = username;
  } else if (email) {
    user = email;
  } else {
    res.status(403).json({
      "error": "This identifier doesn't exist"
    });
  }
  
  // si utilisateur existe
  if (user) {
    // si utilisateur n'est pas verifie
    if (!user.verified) {
      res.status(403).json({
        "error": "This account is not verified"
      });
    } else
    // si utilisateur est verifie
    {
      const result = await compare_hash(req.body.pwd, user.pwd);
      if (result) {
        const token = jsonwebtoken.sign({
          "_id": user._id,
        }, process.env.SECRET_KEY, {
          expiresIn: "24h",
        });
        res
        .cookie('access_token', token, {
          httpOnly: true,
          maxAge: 1000 * 3600 * 24,
        })
        .status(200).json({
          "Message": "Logged in successfully",
        });
      } else {
        res.status(403).json({
          "error": "Wrong password",
        });
      }
    }
  } else
  // si utilisateur n'existe pas
  {
    res.status(403).json({
      "error": "This identifier doesn't exist"
    });
  }
}

/**
 * logout
 * 
 * @param req 
 * @param res 
 */
export function logout(req: Request, res: Response) {
  res
    .clearCookie('access_token')
    .status(200)
    .json({
      "message": "Logged out successfully",
    });
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

export async function resendEmail(req: Request, res: Response) {
  const user = await db.collection('users').findOne({email: req.body.email})

  if (!user) {
    res.status(403).json({
      "error": "This email doesn't exist"
    });
  } else if (user.verified) {
    res.status(403).json({
      "error": "This account is already verified"
    });
  } else {
    const mailer = new Mailer();
    await mailer.email_verif_send(user._id.toString(), req.body.email);
    res.status(200).json({
      'message': 'Email sent'
    });
  }
}
