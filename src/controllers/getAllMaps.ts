import { IMap } from "../interfaces/IMap";
import mapQueries from "../queries/mapQueries";

const getAllMaps = (req:any, res:any, db:any) => {

  const query = {
    name: 'get-all-maps',
    text: mapQueries.getAllMaps
  };

  db.query(query)
    .then((r:any) => {
        if(r.rows.length === 0) {
            res.send({success:false, prompt:'Map does not exist.'});
            return;
        } else {
            res.send({success:true,maps:r.rows});
            return;
        }
    })

}

export default getAllMaps;