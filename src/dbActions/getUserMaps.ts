import mapQueries from "../queries/mapQueries";

const getUserMaps = (db:any, userid:string):Promise<Array<any>> => {

    return new Promise((resolve:any, reject:any) => {
        const query = {
            name: 'get-user-maps',
            text: mapQueries.getUserMaps,
            values: [userid]
        };
    
        db.query(query)
        .then((r:any) => {
            if(r.rows.length === 0) {
                reject("Invalid user id");
            } else {
                resolve(r.rows);
            }
        })
        .catch((err:any) => {
            reject("Error querying database");
        })
    })
}

export default getUserMaps;