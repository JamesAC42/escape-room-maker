// SQL queries to be used to interact with the database; specifically the reviews table
const reviewQueries = {
  addReview:
    "INSERT INTO reviews(uid, map_id, user_id, rating, title, body, timestamp) VALUES ($1, $2, $3, $4, $5, $6, $7)",
  removeReview: "DELETE FROM reviews WHERE uid=$1",
  getReview:
    "SELECT map_id as mapId, user_id as userId, timestamp, rating, title, body FROM reviews WHERE uid=$1",
  getMapReviews:
    "SELECT reviews.uid, reviews.timestamp, reviews.rating, reviews.title, reviews.body, users.username as author FROM reviews INNER JOIN users ON (reviews.user_id = users.uid) WHERE reviews.map_id = $1",
  getUserReviews:
    "SELECT reviews.uid, reviews.timestamp, reviews.rating, reviews.title, reviews.body, users.username as author FROM reviews INNER JOIN users ON (reviews.user_id = users.uid) WHERE reviews.user_id = $1",
};

export default reviewQueries;
