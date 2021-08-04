/*
  retrieves map data for a map with a given id
  used by the query getMap in mapQueries.ts
 */

import { IMap } from "../interfaces/IMap";
import getMap from "../dbActions/getMap";

// The API endpoint for retrieving the data about a specific map by id
const getMapEndpoint = (req: any, res: any, db: any) => {
  // get the map id from the query parameters (GET)
  const mapid = req.query.id;
  if (mapid === undefined) {
    res.send({ success: false });
    return;
  }

  // ensure that the map is a valid uid
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
