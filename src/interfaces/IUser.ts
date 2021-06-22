type timestamp = number;
export interface IUser {

  uid: string,
  email: string,
  password: string,
  username: string,
  dob: timestamp,
  creationDate: timestamp,
  displayName: string,
  admin: boolean,
  verified: boolean,
  favorites: Array<string>,
  played: Array<string>,
  rated: Array<string>,
  settings: string
  
}