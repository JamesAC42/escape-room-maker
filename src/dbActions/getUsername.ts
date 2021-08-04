// Retrieves the username of an account from a given user id
import userQueries from "../queries/userQueries"

const getUsername = (db: any, userid: string): Promise<string> => {
  return new Promise((resolve:any, reject:any) => {
    const query = { // get the username from the database
      name: 'get-username',
      text: userQueries.getUsername,
      values: [userid]
    };

    db.query(query)
    .then((r:any) => {
      if(r.rows.length === 0) { // if there is no user associated with the account...
        reject("Invalid user id"); // tell the system that the id is invalid
      } else { // otherwise...
        resolve(r.rows[0].username); // send the username
      }
    })
  })
}

export default getUsername;
