import { Request } from 'express';
import { db } from '../database/instance';
import { User } from '../interfaces/users.interfaces';
import { Validator } from './validator';

export class UserValidator extends Validator {

  /**
   * Verifies if the value passes to create the new User are valid
   * and verifies if no other user with same username or email already
   *  exists in the db
   * 
   * @param req 
   */
  public async validateUserCreation(req: Request) {
    const user: User = req.body;

    this.isEmpty(user.email);
    this.isEmpty(user.firstname);
    this.isEmpty(user.lastname);
    this.isEmpty(user.username);
    this.isEmpty(user.pwd);
    this.isMail(user.email);

    if(this.isValid()) {
      await this.checkUserNameExists(user.username);
      await this.checkEmailExists(user.email);
    }
  }

  /**
   * validateUserUpdate
   * 
   * @param req 
   */
  public async validateUserUpdate(req: Request) {
    const user: any = req.body;

    if (user.email) {
      this.isMail(user.email);
      await this.checkEmailExists(user.email);
    }
    if (user.username) {
      await this.checkUserNameExists(user.username);
    }
    if (user.pwd) {
      this.isEmpty(user.pwd);
    }
    if (user.firstname) {
      this.isEmpty(user.firstname);
    }
    if (user.lastname) {
      this.isEmpty(user.lastname);
    }
    if (user.admin) {
      this.isEmpty(user.admin);
      this.isBoolean(user.admin);
    }
  }

  /**
   * Verifies if the User username we want to create
   * already exists in the db
   * 
   * @param username
   */
  private async checkUserNameExists(username: string) {
    const result = await db.collection('users').findOne({username});
    if (result != null) {
      this.setError('This username already exists');
    }
  }

  /**
   * Verifie if the user email being created already exists in db
   * 
   * @param email 
   */
  private async checkEmailExists(email: string) {
    const result = await db.collection('users').findOne({email});
    if (result != null){
      this.setError('This E-mail already exists')
    }
  }
}

