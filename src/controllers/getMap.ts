/*
  retrieves map data for a map with a given id
  used by the query getMap in mapQueries.ts
 */

import { IMap } from "../interfaces/IMap";
import mapQueries from "../queries/mapQueries";

const getMap = (req:any, res:any, db:any) => {

    const mapid = req.query.id;
    if(mapid === undefined) {
        res.send({success:false});
        return;
    }

    if(!/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(mapid)) {
        res.send({success:false});
        return;
    }

    const query = {
        name: 'get-map',
        text: mapQueries.getMap,
        values: [mapid]
    };

    db.query(query)
    .then((r:any) => {
        if(r.rows.length === 0) {
            res.send({success:false, prompt:'Map does not exist.'});
            return;
        } else {
            const map:IMap = {
                uid:mapid,
                creator:r.rows[0].creator,
                createdOn: r.rows[0].created_on,
                lastModified: r.rows[0].last_modified,
                ratings: JSON.parse(r.rows[0].ratings),
                timeLimit: r.rows[0].time_limit,
                tags: JSON.parse(r.rows[0].tags),
                description : r.rows[0].description,
                title: r.rows[0].title,
                explicit: r.rows[0].explicit,
                timesCompleted: r.rows[0].times_completed,
                graph: JSON.parse(r.rows[0].graph)
            }

            res.send({success:true,map});
            return;
        }
    })

}

export default getMap;