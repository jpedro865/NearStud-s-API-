import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcrypt';
import { UserValidator } from '../validator/users.validator';
import { db } from '../database/instance';
import jsonwebtoken from 'jsonwebtoken';
import { Mailer } from '../services/Mailer';
import env_vars from '../utils/environment';
import { addRefreshToken } from '../services/tokens.service';

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
  req.body.admin = req.body.admin ?? 0;
  req.body.verified = req.body.verified ?? false;
  req.body.age = req.body.age ? req.body.age as number : 0;

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
export async function connect_user(req: Request, res: Response): Promise<void> {
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
    res.status(400).json({
      "message": "L'identifiant n'existe pas dans notre base"
    });
    return;
  }
  
  // si utilisateur existe
  if (user) {
    // si utilisateur n'est pas verifie
    if (!user.verified) {
      res.status(401).json({
        "message": "Ce compte n'est pas vérifier"
      });
      return;
    } else
    // si utilisateur est verifie
    {
      const result = await compare_hash(req.body.pwd, user.pwd);
      if (result) {
        const token = jsonwebtoken.sign({
          "_id": user._id ?? "",
          "email": user.email ?? "",
          "firstname": user.firstname ?? "",
          "lastname": user.lastname ?? "",
          "username": user.username ?? "",
          "age": user.age ?? 0,
          "admin": user.admin ?? 0,
        }, env_vars.SECRET_KEY, {
          expiresIn: "24h",
        });
        const refresh_token = jsonwebtoken.sign(
          {
            "_id": user._id,
          },
          env_vars.KEY_TOKEN_REFRESH,
          {
            expiresIn: "90 days",
          }
        );
        if (addRefreshToken(user._id.toString(), refresh_token)) {
          res
          .cookie('access_token', token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 15, // 15 minutes
          })
          .cookie('refresh_token', refresh_token, {
            path: '/refresh',
            httpOnly: true,
            maxAge: 1000 * 3600 * 24 * 90, // 90 days
          })
          .status(200).json({
            "message": "Connecté avec succés",
          });
          return;
        } else {
          res.status(500).json({
            "message": "Une erreur est survenu",
          });
          return;
        }
        
      } else {
        res.status(401).json({
          "message": "Mauvais mot-de-passe",
        });
        return;
      }
    }
  } else
  // si utilisateur n'existe pas
  {
    res.status(400).json({
      "message": "L'identifiant n'existe pas dans notre base"
    });
    return;
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
      "message": "Déconnecté avec succés",
    });
}

/**
 * resendEmail
 * 
 * @param req 
 * @param res 
 */
export async function resendEmail(req: Request, res: Response) {
  const user = await db.collection('users').findOne({email: req.body.email})

  if (!user) {
    res.status(400).json({
      "message": "This email doesn't exist"
    });
  } else if (user.verified) {
    res.status(401).json({
      "message": "This account is already verified"
    });
  } else {
    const mailer = new Mailer();
    const sent = await mailer.email_verif_send(user._id.toString(), req.body.email);
    if (!sent.result) {
      res.status(500).json({
        "message": sent.message
      });
    } else {
      res.status(200).json({
        'message': sent.message
      });
    }
  }
}

/**
* deleteUser
* 
* @param req 
* @param res 
*/
export async function deleteUser(req: Request, res: Response) {
  await db.collection('users')
    .deleteOne({_id: new ObjectId(req.params.id)})
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(500).json({
        "Server_Error" : err
      })
    }
  );
}

/**
* updateUser
* 
* @param req 
* @param res 
*/
export async function updateUser(req: Request, res: Response) {
  const validator: UserValidator = new UserValidator();
  await validator.validateUserUpdate(req);

  if (validator.isValid()) {
    const jsonData = await UpdateDataParse(req);
    await db.collection('users')
        .updateOne({_id: new ObjectId(req.params.id)},
          {
            ...jsonData
          })
        .then((data) => {
          res.status(200).json(data);
        })
        .catch((err) => {
          res.status(500).json({
            "Server_Error" : err
          })
        }
      );
  } else {
    res.status(400).json({
      'error_list': validator.getErrors()
    });
  }
}

/**
 * addFields
 * 
 * ajouter des champs a tous les utilisateurs
 * 
 * @param req 
 * @param res 
 */
export async function addFields(req: Request, res: Response) {
  const fields_name = JSON.stringify(req.body).match(/"([^"]*)"/g).join().replace(/"/g, '').split(',');

  let matchString = '{ "email": {"$exists": true}, ';
  for (const element of fields_name) {
    matchString += '"' + element + '": {"$exists": false},';
  }
  matchString += "}";
  matchString = matchString.replace(',}', '}');
  const matchData = JSON.parse(matchString);

  await db.collection('users')
    .updateMany({...matchData},
      {
        $set: {
          ...req.body
        }
      })
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
 * deleteFields
 * 
 * supprimer des champs a tous les utilisateurs
 * 
 * @param req 
 * @param res 
 */
export async function deleteFields(req: Request, res: Response) {  
  await db.collection('users')
    .updateMany({email: {$exists: true}},
      {
        $unset: {
          ...req.body
        }
      })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(500).json({
        "Server_Error" : err
      })
    });
}

/** *************************** Helper Functions ****************************** */

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

async function UpdateDataParse(req: Request) {
  let data = '{"$set": {';
  req.body.firstname? data += '"firstname": "' + req.body.firstname + '",': data+= '';
  req.body.lastname? data += '"lastname": "' + req.body.lastname + '",': data+= '';
  req.body.username? data += '"username": "' + req.body.username + '",': data+= '';
  req.body.email? data += '"email": "' + req.body.email + '",': data+= '';
  req.body.pwd? data += '"pwd":"' + await crypt_pwd(req.body.pwd) + '",': data+= '';
  req.body.admin? data += '"admin": ' + req.body.admin + ',': data+= '';
  data += '}}';
  data = data.replace(',}}', '}}');
  const jsonData = JSON.parse(data);
  return jsonData
}


