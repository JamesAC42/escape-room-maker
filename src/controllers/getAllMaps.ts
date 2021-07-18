import { IMap } from "../interfaces/IMap";
import mapQueries from "../queries/mapQueries";

const getAllMaps = (req:any, res:any, db:any) => {

  const query = {
    name: 'get-all-maps',
    text: mapQueries.getAllMaps
  };

  db.query(query) //do I need to do this multiple times for many maps?
    .then((r:any) => {
        if(r.rows.length === 0) {
            res.send({success:false, prompt:'Map does not exist.'});
            return;
        } else { //since I don't need all the info for the library page, some properties aren't filled out
            const map:IMap = { // so this doesn't make a full map object
                creator:r.rows[0].creator,
                createdOn: r.rows[0].created_on,
                tags: JSON.parse(r.rows[0].tags),
                description : r.rows[0].description,
                title: r.rows[0].title,
                timesCompleted: r.rows[0].times_completed
            }

            res.send({success:true,map});
            return;
        }
    })

}