import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { db } from '../database/instance';
import { RestoValidator } from '../validator/resto.validator';
import { Coord } from '../interfaces/resto.interface';

/**
 * createResto
 * 
 * @param req 
 * @param res 
 */
export async function createResto(req: Request, res: Response) {
  const validator: RestoValidator = new RestoValidator();
  validator.validateRestoCreation(req);

  if (validator.isValid()) {
    await db.collection('restaurants')
      .insertOne(req.body)
      .then((data) => {
        res.status(201).json(data);
      })
      .catch(e => {
        res.status(500).json({
          "message": e
        });
      })
  } else {
    res.status(400).json({
      'error_list': validator.getErrors()
    });
  }
}

/**
 * getRestoById
 * 
 * @param req 
 * @param res 
 */
export async function getRestoById(req: Request, res: Response) {
  const _id: string = req.params.id as string;

  await db.collection('restaurants')
    .findOne({_id: new ObjectId(_id)})
    .then(data => {
      res.status(200).json(data);
    })
    .catch(e => {
      res.status(500).json({
        "ERREUR_SERVER": e
      });
    });
}

/**
 * getAllResto
 * 
 * @param req 
 * @param res 
 */
export async function getAllResto(req: Request, res: Response) {
  await db.collection('restaurants')
    .find()
    .toArray()
    .then(data => {
      res.status(200).json(data);
    })
    .catch(e => {
      res.status(500).json({
        "message": e
      });
    });
}

/**
 * updateResto
 * 
 * @param req 
 * @param res 
 */
export async function getRestosFavoris(req: Request, res: Response) {
  const favoris_string: string[] = req.body.favoris as string[];
  var favoris: ObjectId[] = [];
  
  // Convertir les string en ObjectId
  // necessaire pour la requete
  for (var i = 0; i < favoris_string.length; i++) {
    favoris[i] = new ObjectId(favoris_string[i]);
  }

  await db.collection('restaurants')
    .find({_id: {$in: favoris}})
    .toArray()
    .then(data => {
      res.status(200).json(data);
    })
    .catch(e => {
      res.status(500).json({
        "message": e
      });
    });
}

/**
 * getRestosZone
 * 
 * renvoi les 20 restaurants le mieux note autour de la position
 * 
 * @param req 
 * @param res 
 */
export async function getRestosZone(req: Request, res: Response) {
  var cornerBL: Coord = req.body.cornerBL as Coord;
  var cornerTR: Coord = req.body.cornerTR as Coord;


  if (!cornerBL || !cornerTR) {
    res.status(400).json({
      "message": "Les coordonnees sont obligatoires"
    });
    return;
  }
  await db.collection('restaurants')
    .find({
      "coord.lat": {$gt: cornerBL.lat, $lt: cornerTR.lat},
      "coord.lng": {$gt: cornerBL.lng, $lt: cornerTR.lng}
    })

    .toArray()
    .then(data => {
      res.status(200).json(data);
    })
    .catch(e => {
      res.status(500).json({
        "message": e.message
      });
    });
}

/**
 * searchResto
 * 
 * recherche un restaurant par son nom ou sa cuisine
 * 
 * @param req 
 * @param res 
 */
export async function searchResto(req: Request, res: Response) {
  const search: string = req.body.search as string;

  await db.collection('restaurants')
    .find({
      $or: [
        {
          nom: {
            $regex: search, $options:'i'
          }
        },
        {
          cuisine: {
            $regex: search, $options:'i'
          }
        }
      ]
    })
    .toArray()
    .then(data => {
      res.status(200).json(data);
    })
    .catch(e => {
      res.status(500).json({
        "message": e.message
      });
    });
}
