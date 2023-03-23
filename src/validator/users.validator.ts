import { Request } from 'express';
import { db, client} from '../database/instance';
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
  public validateUserCreation(req: Request) {
    const user: User = req.body;
    this.checkUserNameExists(user.username);
  }

  /**
   * Verifies if the User username we want to create
   * already exists in the db
   * 
   * @param username
   */
  private async checkUserNameExists(username: String) {
    await client.connect();
    await db.collection('users')
      .findOne({username})
        .then( data => {
          if (data == null) {
            this.setError()
          }
        })
    await client.close()
  }
}

