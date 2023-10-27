import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { db } from '../database/instance';
import { RestoValidator } from '../validator/resto.validator';

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
          "ERREUR_SERVER": e
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
        "ERREUR_SERVER": e
      });
    });
}