import getUserFavorites from "../dbActions/getUserFavorites";
import setUserFavorites from "../dbActions/setUserFavorites";

/*
  API Controller for removing a favorite from a user's list of favorites.
 Takes a request and response object, as well as a database object
 The map id of the favorite to be removed is in the req body
*/
const removeFavorite = (req: any, res: any, db: any) => {
  // Get the map id from the req body
  const { mapid } = req.body;

  // Make sure the id was provided
  if (mapid === undefined) {
    res.send({ success: false, message: "Invalid schema" });
    return;
  }

  // Make sure the client has a valid session, get the userid
  const userId = req.session.key;
  if (userId === undefined) {
    res.send({ success: false, message: "Invalid session" });
    return;
  }

  // Make sure the map id is a valid uid
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
    // If the map id given is contained within the user's favorites, remove it
    let index = favorites.indexOf(mapid);
    if (index !== -1) {
      favorites.splice(index, 1);
    }

    // Set the new favorites back into the database
    setUserFavorites(db, userId, favorites)
      .then(() => {
        res.send({ success: true });
        return;
      })
      .catch((err: Error) => {
        console.error(err);
        res.send({ success: false });
      });
  });
};

export default removeFavorite;
