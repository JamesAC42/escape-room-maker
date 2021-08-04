import getUserFavorites from "../dbActions/getUserFavorites";
import setUserFavorites from "../dbActions/setUserFavorites";
import { IMap } from "../interfaces/IMap";
import getMap from "../dbActions/getMap";

// API controller for adding a map to a user's favorites list.
// Takes a req and res object, and a database object.
// The map id to be added is in the req body
const addFavorite = (req: any, res: any, db: any) => {
  // Get the map id from the req body
  const { mapid } = req.body;

  // Make sure the id was provided
  if (mapid === undefined) {
    res.send({ success: false, message: "Invalid schema" });
    return;
  }

  // Ensure the client has a valid session, get the user id
  const userId = req.session.key;
  if (userId === undefined) {
    res.send({ success: false, message: "Invalid session" });
    return;
  }

  // Ensure the map id is a valid uid
  if (
    !/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
      mapid
    )
  ) {
    res.send({ success: false, message: "Invalid schema" });
    return;
  }

  // Get the user's favorites from the database
  getUserFavorites(db, userId).then((favorites: Array<string>) => {
    // Get the map information of the given map id
    getMap(db, mapid)
      .then((map: IMap) => {
        // Add the map id to the list of favorites
        favorites.push(mapid);

        // Set the new favorites list back into the database
        setUserFavorites(db, userId, favorites)
          .then(() => {
            // Send the map data back to the client
            res.send({
              success: true,
              map,
            });
            return;
          })
          .catch((err: Error) => {
            console.error(err);
            res.send({ success: false });
          });
      })
      .catch((err: Error) => {
        console.error(err);
        res.send({ success: false });
      });
  });
};

export default addFavorite;
