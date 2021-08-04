import { IMap } from "../interfaces/IMap";
import mapQueries from "../queries/mapQueries";

/*
  Retrieves map data for any map.
  Used by the query getAllMaps in mapQueries.ts
*/
const getAllMaps = (req: any, res: any, db: any) => {

  // Construct the query
  const query = {
    name: "get-all-maps",
    text: mapQueries.getAllMaps,
  };

  // Execute the query
  db.query(query)
    .then((r: any) => {
      r.rows.forEach((map: any) => {
        // Rename the field to conform to JSON standards
        map.createdOn = map.created_on;
        delete map.created_on;
      });
      res.send({ success: true, maps: r.rows });
      return;
    })
    .catch((error: Error) => {
      console.error(error);
      res.send({ success: false, message: "Error reading database" });
      return;
    });
};

export default getAllMaps;
