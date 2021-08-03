/*
  retrieves map data for any map
  used by the query getAllMaps in mapQueries.ts
 */

import { IMap } from "../interfaces/IMap";
import mapQueries from "../queries/mapQueries";

const getAllMaps = (req:any, res:any, db:any) => {

  // make a getAllMaps query
  const query = {
    name: 'get-all-maps',
    text: mapQueries.getAllMaps
  };

  db.query(query)
    .then((r:any) => { // get the map info from the database
      res.send({success:true,maps:r.rows});
      return;
    })
    .catch((Error:any) => {
      console.error(Error);
      res.send({success:false,message:"error reading database"});
      return;
    })

}

export default getAllMaps;