const mapQueries = {
  createMap:
    "INSERT INTO maps(uid, creator, created_on, last_modified, ratings, time_limit, tags, description, title, explicit, times_completed, graph) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)",
  getMap:
    "SELECT created_on, last_modified, ratings, time_limit, tags, description, title, explicit, times_completed, graph, users.username as creator FROM maps INNER JOIN users ON (maps.creator = users.uid) WHERE maps.uid = $1",
  getAllMaps:
    "SELECT maps.uid, created_on, tags, description, ratings, title, times_completed, users.username as creator FROM maps INNER JOIN users ON (maps.creator = users.uid) WHERE 1 = 1",
  getUserMaps:
    "SELECT maps.uid, created_on, tags, ratings, description, title, times_completed, users.username as creator FROM maps INNER JOIN users ON (maps.creator = users.uid) WHERE creator = $1",
};

export default mapQueries;
