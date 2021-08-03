// Database action to return a list of map data object for a given list of
// map ids
const getMapsFromIds = (db:any, ids:Array<string>):Promise<Array<any>> => {
  return new Promise((resolve:any, reject:any) => {
    // If there were no ids then just resolve an empty list
    if (ids.length === 0) {
      resolve([])
      return
    }

    // Construct the query string
    const params = ids.map((id:string, index:number) => { return '$' + (index + 1) })
    const queryString = 'SELECT uid, created_on, tags, ratings, description, title, times_completed FROM maps WHERE uid IN (' +
            params.join(',') + ')'

    // Construct the query object
    const query = {
      text: queryString,
      values: [...ids]
    }

    db.query(query)
      .then((r:any) => {
        if (r.rows.length === 0) {
          reject(new Error('Error retrieving maps'))
        } else {
          // Parse the tags and ratings JSON stored in each map
          r.rows.forEach((map:any) => {
            map.tags = JSON.parse(map.tags)
            map.createdOn = map.created_on
            delete map.created_on
            map.ratings = JSON.parse(map.ratings)
          })
          // Resolve the map data
          resolve(r.rows)
        }
      })
      .catch((err:Error) => {
        reject(err)
      })
  })
}

export default getMapsFromIds
