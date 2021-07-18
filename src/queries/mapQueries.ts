const mapQueries = {
    createMap: "INSERT INTO maps(uid, creator, created_on, last_modified, ratings, time_limit, tags, description, title, explicit, times_completed, graph) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)",
    getMap: "SELECT creator, created_on, last_modified, ratings, time_limit, tags, description, title, explicit, times_completed, graph FROM maps WHERE uid = $1",
    getAllMaps: "SELECT creator, created_on, tags, description, title, times_completed FROM maps"
}

export default mapQueries;