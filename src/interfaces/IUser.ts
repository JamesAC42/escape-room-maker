export interface IUser {

  uid: string,
  email: string,
  password: string,
  username: string,
  dob: Date,
  creation_date: Date,
  display_name: string,
  admin: boolean,
  verified: boolean,
  favorites: Array<string>,
  played: Array<string>,
  rated: Array<string>,
  settings: string
  
}