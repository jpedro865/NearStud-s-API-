/**
 * Validator class
 * 
 */
export class Validator {

  private isvalid = true;
  private errors: Array<string> = new Array;

  /**
   * Verifies if a value is empty
   * @param value 
   * @returns boolean
   */
  public isEmpty(value: any) {
    if ( value == null || value == undefined) {
      this.setError('This case is empty');
    }
  }

  public isMail(value: string) {
    const expression: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!expression.test(value)){
      this.setError('Email not valid');
    }
  }

  public isValid() {
    return this.isvalid;
  }

  public setError(message: string) {
    this.errors.push(message);
    this.isvalid = false;
  }

  public getErrors() {
    return this.errors;
  }

}