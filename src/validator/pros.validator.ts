import { Validator } from './validator';
import { Pro } from '../interfaces/pros.interface';
import { Request } from 'express';

export class ProsValidator extends Validator {

  /**
   * validateProCreation
   * @param req 
   */
  public validateProCreation(req: Request) {
    const pro: Pro = req.body;

    // check valeurs qui ne peuvent pas etre vides
    this.isEmpty(pro.nom);
    this.isEmpty(pro.adresse.cp);
    this.isEmpty(pro.adresse.ville);
    this.isEmpty(pro.adresse.rue);
    this.isEmpty(pro.adresse.pays);
    this.isEmpty(pro.coord);
    this.isEmpty(pro.cuisine);

    if (this.isValid()) {
      this.isString(pro.nom);
      this.isNumber(pro.adresse.cp);
      this.isString(pro.adresse.ville);
      this.isString(pro.adresse.rue);
      this.isString(pro.adresse.pays);
      this.isNumber(pro.coord[0]);
      this.isNumber(pro.coord[1]);
      this.isArrayOfString(pro.cuisine);
    }
  }

}
