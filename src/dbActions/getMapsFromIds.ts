/*
  Database action to return a list of map data objects for a given list of
  map IDs
*/
const getMapsFromIds = (db: any, ids: Array<string>): Promise<Array<any>> => {
  return new Promise((resolve: any, reject: any) => {
    // If there were no ids then just resolve an empty list
    if (ids.length === 0) {
      resolve([]);
      return;
    }

    // Construct the query string dynamically so that we
    // search for multiple maps
    const params = ids.map((id: string, index: number) => {
      return "$" + (index + 1);
    });
    const queryString =
      "SELECT maps.uid, created_on, tags, ratings, description, maps.title, times_completed, COUNT(reviews.map_id) as reviews, users.username as creator FROM maps INNER JOIN users ON (maps.creator = users.uid) LEFT JOIN reviews ON (maps.uid = reviews.map_id) WHERE maps.uid IN (" +
      params.join(",") +
      ") GROUP BY maps.uid, users.username";

    // Construct the query object
    const query = {
      text: queryString,
      values: [...ids],
    };

    db.query(query)
      .then((r: any) => {
        if (r.rows.length === 0) {
          reject(new Error("Error retrieving maps"));
        } else {
          // Parse the tags and ratings JSON stored in each map
          r.rows.forEach((map: any) => {
            map.tags = JSON.parse(map.tags);
            map.createdOn = map.created_on;
            delete map.created_on;
            map.ratings = JSON.parse(map.ratings);
          });
          // Resolve the map data
          resolve(r.rows);
        }
      })
      .catch((err: Error) => {
        reject(err);
      });
  });
};

export default getMapsFromIds;
