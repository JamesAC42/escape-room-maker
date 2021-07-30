const mapQueries = {
    createMap: "INSERT INTO maps(uid, creator, created_on, last_modified, ratings, time_limit, tags, description, title, explicit, times_completed, graph) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)",
    getMap: "SELECT creator, created_on, last_modified, ratings, time_limit, tags, description, title, explicit, times_completed, graph FROM maps WHERE uid = $1",
    getAllMaps: "SELECT uid, creator, created_on, tags, description, ratings, title, times_completed FROM maps WHERE 1 = 1",
    getUserMaps: "SELECT uid, created_on, tags, ratings, description, title, times_completed FROM maps WHERE creator = $1"
}

export default mapQueries;