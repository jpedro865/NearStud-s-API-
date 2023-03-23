import { Request } from "express";

export class Validator {

  public req: Request;
  private isvalid = true;

  Validator(req: Request){
    this.req = req;
  }

  /**
   * Verifies if a value is empty
   * @param value 
   * @returns boolean
   */
  public isEmpty(value: any) {
    if ( value == null || value == undefined) {
      this.isvalid = true;
    } else {
      this.isvalid = false;
    }
  }

  public isValid() {
    return this.isvalid;
  }

  public setError() {
    this.isvalid == false;
  }

}