import userQueries from "../queries/userQueries";

// Database action to get a user's favorite maps
const getUserFavorites = (db: any, userid: string): Promise<Array<string>> => {
  return new Promise((resolve: any, reject: any) => {
    // Construct the database query
    const query = {
      name: "get-user-favorites",
      text: userQueries.getFavorites,
      values: [userid],
    };

    // Perform the query
    db.query(query)
      .then((r: any) => {
        if (r.rows.length === 0) {
          reject(new Error("Invalid user"));
          return;
        }
        // Parse the list and send it back to the caller
        resolve(JSON.parse(r.rows[0].favorites));
      })
      .catch((err: Error) => {
        reject(err);
      });
  });
};

export default getUserFavorites;
