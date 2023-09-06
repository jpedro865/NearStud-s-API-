import { Request } from 'express';
import { Validator } from './validator';
import { Resto } from '../interfaces/resto.interface';

export class RestoValidator extends Validator {

  /**
   * validateRestoCreation
   * @param req 
   */
  public validateRestoCreation(req: Request) {
    const resto: Resto = req.body;

    // check valeurs qui ne peuvent pas etre vides
    this.isEmpty(resto.nom);
    this.isEmpty(resto.adresse.cp);
    this.isEmpty(resto.adresse.ville);
    this.isEmpty(resto.adresse.rue);
    this.isEmpty(resto.adresse.pays);
    this.isEmpty(resto.coord);
    this.isEmpty(resto.cuisine);

    if (this.isValid()) {
      this.isString(resto.nom);
      this.isNumber(resto.adresse.cp);
      this.isString(resto.adresse.ville);
      this.isString(resto.adresse.rue);
      this.isString(resto.adresse.pays);
      this.isNumber(resto.coord[0]);
      this.isNumber(resto.coord[1]);
      this.isArrayOfString(resto.cuisine);
    }
  }
}