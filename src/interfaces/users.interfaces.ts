export interface User {
  _id: string,
  firstname: string,
  lastname: string,
  username: string,
  email: string,
  pwd: string,
  admin: number,
  verified: boolean,
  age: number,
  date_creation: Date,
  last_updated: Date,
}
