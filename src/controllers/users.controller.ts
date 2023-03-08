import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { db, client} from '../database/instance';

export async function getAll(req: Request, res: Response) {
  await client.connect();
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
  await client.close();
}

export async function getById(req: Request, res: Response) {
  if (ObjectId.isValid(req.params.id)) {
    await client.connect();
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
    await client.close();
  } else {
    res.status(500).json({
      'error': 'Not a valid ObjectId document'
    });
  }
  
}
