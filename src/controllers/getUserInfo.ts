import getMapsFromIds from "../dbActions/getMapsFromIds";
import userQueries from "../queries/userQueries";

/*
  API endpoint that retrieves user data for a user with a given id.
  Used by the query getUser in userQueries.ts
 */
const getUserInfo = (req: any, res: any, db: any) => {

  // Print out some diagnostic info
  console.log("Session requested...");
  console.log(`sessionID: ${req.session.id}`);
  console.log(`key: ${req.session.key}`);

  // Check if the client has a session, get the userid
  const userId = req.session.key;
  if (userId === undefined) {
    res.send({ loggedout: true });
    return;
  }

  // Construct query for getting the data from the database
  const query = {
    name: "get-user",
    text: userQueries.getUser,
    values: [userId],
  };

  // Make the query
  db.query(query)
    .then((r: any) => {
      // User was not found in the database, so destroy the session
      if (r.rows.length === 0) {
        req.session.destroy((err: any) => {
          res.send({ loggedout: true });
          return;
        });
      } else {
        // Extract the information retrieved from the database row
        let {
          username,
          email,
          creation_date,
          dob,
          verified,
          display_name,
          admin,
          rated,
          settings,
          played,
          favorites,
        } = r.rows[0];

        // If the admin value was null then initialize it
        if (admin === null) admin = false;

        // Parse the JSON containing the list of favorites so
        // we can use it to make another query that will return
        // the actual map data for each map id
        let favoriteIds = JSON.parse(favorites);
        // Get all the map data for the user's favorites
        getMapsFromIds(db, favoriteIds).then((maps: Array<any>) => {
          // Send all the user data back to the client
          res.send({
            success: true,
            loggedout: false,
            username,
            email,
            uid: userId,
            creation_date: new Date(creation_date),
            dob: new Date(dob),
            verified,
            display_name,
            admin,
            rated: JSON.parse(rated),
            settings: JSON.parse(settings),
            played: JSON.parse(played),
            favorites: maps,
          });
        });
      }
    })
    .catch((e: Error) => {
      console.error(e);
      res.send({
        loggedout: true,
        success: false,
        error: "User does not exist",
      });
    });
};

export default getUserInfo;
