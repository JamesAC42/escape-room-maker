import userQueries from "../queries/userQueries";

// Database action for setting a user's favorites
const setUserFavorites = (
  db: any,
  userid: string,
  favorites: Array<string>
): Promise<any> => {
  return new Promise((resolve: any, reject: any) => {
    
    // Construct the database query
    const query = {
      name: "set-user-favorites",
      text: userQueries.setFavorites,
      values: [JSON.stringify(favorites), userid],
    };

    // Perform the query
    db.query(query)
      .then((r: any) => {
        if (r.rows.length > 0) {
          reject(new Error("Error setting favorites"));
          return;
        }
        // Signify to caller that the query has completed
        resolve();
      })
      .catch((err: Error) => {
        reject(err);
      });
  });
};

export default setUserFavorites;
