export interface User {
  _id: string,
  firstname: string,
  lastname: string,
  username: string,
  email: string,
  pwd: string,
  admin: number,
  verified: boolean,
  date_creation: Date,
  last_updated: Date,
}
