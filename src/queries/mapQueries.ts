// SQL queries to be used to interact with the database; specifically the map table
const mapQueries = {
  createMap:
    "INSERT INTO maps(uid, creator, created_on, last_modified, ratings, time_limit, tags, description, title, explicit, times_completed, graph) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)",
  getMap:
    "SELECT created_on, last_modified, ratings, time_limit, tags, description, maps.title, explicit, times_completed, graph, users.username as creator FROM maps INNER JOIN users ON (maps.creator = users.uid) WHERE maps.uid = $1",
  getAllMaps:
    "SELECT maps.uid, created_on, tags, COUNT(reviews.map_id) as reviews, description, ratings, maps.title, times_completed, users.username as creator FROM maps INNER JOIN users ON (maps.creator = users.uid) LEFT JOIN reviews ON (maps.uid = reviews.map_id) WHERE 1 = 1 GROUP BY maps.uid, users.username",
  getUserMaps:
    "SELECT maps.uid, created_on, tags, COUNT(reviews.map_id) as reviews, description, maps.title, times_completed, users.username as creator FROM maps LEFT JOIN users ON (maps.creator = users.uid) LEFT JOIN reviews ON (maps.uid = reviews.map_id) WHERE maps.creator = $1 GROUP BY maps.uid, users.username",
};

export default mapQueries;
