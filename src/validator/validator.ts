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
    if ( value == null || value == undefined || value == '' || value.length == 0) {
      this.setError('This case is empty');
    }
  }

  /**
   * isMail
   * 
   * @param value 
   */
  public isMail(value: string) {
    const expression: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!expression.test(value)){
      this.setError('Email not valid');
    }
  }

  /**
   * isNumber
   * 
   * @param value 
   */
  public isNumber(value: any) {
    if (isNaN(value)) {
      this.setError('This value is not a number');
    }
  }

  /**
   * isBoolean
   * 
   * @param value 
   */
  public isBoolean(value: any) {
    if (typeof value != 'boolean') {
      this.setError('This value is not a boolean');
    }
  }

  /**
   * isString
   * 
   * @param value 
   */
  public isString(value: any) {
    if (typeof value != 'string') {
      this.setError('This value is not a string');
    }
  }

  /**
   * isValid
   * 
   * @returns boolean
   */
  public isValid() {
    return this.isvalid;
  }

  /**
   * setError
   * 
   * @param message 
   */
  public setError(message: string) {
    this.errors.push(message);
    this.isvalid = false;
  }

  /**
   * getErrors
   * 
   * @returns Array<string>
   */
  public getErrors() {
    return this.errors;
  }

}
