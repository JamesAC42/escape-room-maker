import { IMap } from "../interfaces/IMap";
import getMap from "../dbActions/getMap";

/*
  API endpoint the retrieves map data for a map with a given ID.
  Used by the query getMap in mapQueries.ts
*/
const getMapEndpoint = (req: any, res: any, db: any) => {
  // Get the map id from the query parameters (GET)
  const mapid = req.query.id;
  if (mapid === undefined) {
    res.send({ success: false });
    return;
  }

  // Ensure that the map is a valid uid
  if (
    !/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
      mapid
    )
  ) {
    res.send({ success: false });
    return;
  }

  // Get the map's data
  getMap(db, mapid)
    .then((map: IMap) => {
      // Send the data back to the client
      res.send({ success: true, map });
      return;
    })
    .catch((err: Error) => {
      console.log(err);
      res.send({ success: false, message: "Error retrieving map" });
      return;
    });
};

export default getMapEndpoint;
