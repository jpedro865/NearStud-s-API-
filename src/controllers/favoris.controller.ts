import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { db } from '../database/instance';

/**
 * addFavoris
 * 
 * @param req 
 * @param res 
 */
export function addFavoris(req: Request, res: Response) {
  const _id: string = req.params.id as string;
  const id_resto: string = req.params.id_resto as string;

  db.collection('users')
    .updateOne(
      {_id: new ObjectId(_id)},
      {$addToSet: {favoris: id_resto}}
    )
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
 * removeFavoris
 * 
 * @param req 
 * @param res 
 */
export function removeFavoris(req: Request, res: Response) {
  const _id: string = req.params.id as string;
  const id_resto: string = req.params.id_resto as string;

  db.collection('users')
    .updateOne(
      {_id: new ObjectId(_id)},
      {$pull: {favoris: id_resto}}
    )
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
 * getFavoris
 * 
 * @param req 
 * @param res 
 */
export function getFavoris(req: Request, res: Response) {
  const _id: string = req.params.id as string;

  db.collection('users')
    .findOne({_id: new ObjectId(_id)})
    .then(data => {
      if (!data.favoris) {
        res.status(200).json([]);
      } else {
        res.status(200).json(data.favoris);      
      }
    })
    .catch(e => {
      res.status(500).json({
        "ERREUR_SERVER": e
      });
    });
}