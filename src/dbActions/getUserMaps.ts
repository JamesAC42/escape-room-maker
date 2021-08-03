import mapQueries from '../queries/mapQueries'

// Database action for getting all maps created by a certain user
const getUserMaps = (db:any, userid:string):Promise<Array<any>> => {
  return new Promise((resolve:any, reject:any) => {
    // Construct the database query
    const query = {
      name: 'get-user-maps',
      text: mapQueries.getUserMaps,
      values: [userid]
    }

    // Perform the query
    db.query(query)
      .then((r:any) => {
        if (r.rows.length === 0) {
          reject('Invalid user id')
        } else {
          // Parse the JSON for the tags and ratings list stored in each map
          r.rows.forEach((map:any) => {
            map.tags = JSON.parse(map.tags)
            map.createdOn = map.created_on
            delete map.created_on
            map.ratings = JSON.parse(map.ratings)
          })
          // Send the data back to the caller
          resolve(r.rows)
        }
      })
      .catch((err:any) => {
        reject('Error querying database')
      })
  })
}

export default getUserMaps
