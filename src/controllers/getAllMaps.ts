import { IMap } from "../interfaces/IMap";
import mapQueries from "../queries/mapQueries";

const getAllMaps = (req:any, res:any, db:any) => {

  const query = {
    name: 'get-all-maps',
    text: mapQueries.getAllMaps
  };

  db.query(query)
    .then((r:any) => {
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