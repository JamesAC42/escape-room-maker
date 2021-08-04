const bcrypt = require("bcrypt");
import getMapsFromIds from "../dbActions/getMapsFromIds";
import userQueries from "../queries/userQueries";

// API endpoint for logging in
const login = (req: any, res: any, db: any) => {

  // Extract the provided email and password from the req body
  const { email, password } = req.body;

  // Validate the proper information was provided
  if (email === undefined || password === undefined) {
    res.send({
      success: false,
      error: "Invalid schema",
    });
    return;
  }

  // Construct the query to find the user by email in the database
  const query = {
    name: "find-user-login",
    text: userQueries.findUserByEmail,
    values: [email],
  };

  db.query(query)
    .then((r: any) => {
      // User was not found if no rows are returned
      if (r.rows.length === 0) {
        res.send({
          success: false,
          error: "User does not exist",
        });
      } else {
        // Extract the password hash from the user row
        const pw = r.rows[0].password;

        // Compare hashes to see if the client provided the correct password
        bcrypt.compare(password, pw, (err: any, result: boolean) => {
          if (result) {
            // If passwords matches, then log the user in.
            // Create a session for the client and store the userid in it
            req.session.key = r.rows[0].uid;

            // Construct the query for getting a user's information
            const userdataquery = {
              name: "login-data",
              text: userQueries.getUser,
              values: [r.rows[0].uid],
            };

            db.query(userdataquery)
              .then((datar: any) => {
                if (datar.rows.length === 0) {
                  throw new Error("Invalid user");
                } else {
                  // Extract the data returned from the query
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
                  } = datar.rows[0];

                  if (admin === null) admin = false;

                  // Parse the JSON containing the list of favorites so that the
                  // actual map information can be retrieved for each
                  let favoritesIds = JSON.parse(favorites);

                  // Get the map data for each favorite
                  getMapsFromIds(db, favoritesIds).then((maps: Array<any>) => {
                    // Send all the data back to the client
                    res.send({
                      success: true,
                      loggedout: false,
                      username,
                      email,
                      uid: r.rows[0].uid,
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
                  success: false,
                  error: "User does not exist",
                });
              });
          } else {
            res.send({
              success: false,
              error: "Password was incorrect",
            });
          }
        });
      }
    })
    .catch((e: Error) => {
      console.error(e);
      res.send({
        success: false,
        error: "User does not exist",
      });
    });
};

export default login;
