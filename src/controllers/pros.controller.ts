import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { db } from '../database/instance';
import { RestoValidator } from '../validator/resto.validator';

interface Professional {
  _id: ObjectId;
  name: string;
  email: string;
  password: string;
  restaurant: Restaurant;
}

interface Restaurant {
  name: string;
  address: string;
  phone: string;
}

export const prosController = {
  async create(req: Request, res: Response) {
    const { name, email, password, restaurant } = req.body;

    const validator = new RestoValidator();
    validator.validateRestoCreation(restaurant);
    if (validator.isValid()) {
      return res.status(400).json(validator.getErrors());
    }

    const professional: Professional = {
      _id: new ObjectId(),
      name,
      email,
      password,
      restaurant,
    };

    try {
      const result = await db.collection('professionals').insertOne(professional);
      return res.status(201).json(result.acknowledged);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  async getById(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const professional = await db.collection('professionals').findOne({ _id: new ObjectId(id) });
      if (!professional) {
        return res.status(404).json({ error: 'Professional not found' });
      }
      return res.json(professional);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { name, email, password, restaurant } = req.body;

    const validator = new RestoValidator();
    validator.validateRestoCreation(restaurant);
    if (validator.isValid()) {
      return res.status(400).json(validator.getErrors());
    }

    const professional: Professional = {
      _id: new ObjectId(id),
      name,
      email,
      password,
      restaurant,
    };

    try {
      const result = await db.collection('professionals').replaceOne({ _id: new ObjectId(id) }, professional);
      if (result.modifiedCount === 0) {
        return res.status(404).json({ error: 'Professional not found' });
      }
      return res.json(professional);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const result = await db.collection('professionals').deleteOne({ _id: new ObjectId(id) });
      if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'Professional not found' });
      }
      return res.status(204).send();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },
};



