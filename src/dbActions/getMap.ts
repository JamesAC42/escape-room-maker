import mapQueries from "../queries/mapQueries";
import { IMap } from "../interfaces/IMap";

// Database action for getting the information for a given map
const getMap = (db:any, mapid:string):Promise<any> => {

    return new Promise((resolve:any, reject:any) => {

        // Contruct the query to retrieve the information
        const query = {
            name: 'get-map',
            text: mapQueries.getMap,
            values: [mapid]
        };
    
        db.query(query)
        .then((r:any) => {
            // If no rows were returned, then that map does not exist
            if(r.rows.length === 0) {
                reject(new Error("Map does not exist"));
                return;
            } else {

                // Parse out all the information and make a new IMap object from it
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

                // Resolve the map data back to whoever requested it
                resolve(map);

                return;
            }
        })
        .catch((err:Error) => {
            reject(err);
        })

    })

}

export default getMap;