import getUserMaps from "../dbActions/getUserMaps";

/*
  API endpoint for retrieving a user's own maps.
*/
const getMyMaps = (req: any, res: any, db: any) => {
  // Ensure that the client has a valid session. Get their ID
  const userid = req.session.key;
  if (userid === undefined) {
    res.send({ success: false });
    return;
  }

  // Get all the maps created by this user
  getUserMaps(db, userid)
    .then((maps: Array<any>) => {
      // Send the maps back to the client
      res.send({
        success: true,
        maps,
      });
    })
    .catch((err: Error) => {
      console.error(err);
      res.end({ success: false });
    });
};

export default getMyMaps;
