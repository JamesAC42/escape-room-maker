import reviewQueries from "../queries/reviewQueries";

// Get a review from the database by ID
const getReview = (db: any, uid: string): Promise<any> => {
  return new Promise((resolve: any, reject: any) => {
    // Construct the query
    const query = {
      name: "get-review",
      text: reviewQueries.getReview,
      values: [uid],
    };

    // Execute the query
    db.query(query)
      .then((r: any) => {
        if (r.rows.length === 0) {
          reject(new Error("Review does not exist"));
          return;
        }

        // Resolve the data that was retrieved
        resolve(r.rows[0]);
      })
      .catch((err: Error) => {
        reject(err);
      });
  });
};

export default getReview;
