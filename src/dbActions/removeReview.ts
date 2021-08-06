import reviewQueries from "../queries/reviewQueries";

// Removes a review from the database by UID
const removeReview = (db: any, uid: string): Promise<any> => {
  return new Promise((resolve: any, reject: any) => {
    // Construct the query
    const query = {
      name: "remove-review",
      text: reviewQueries.removeReview,
      values: [uid],
    };

    // Execute the query
    db.query(query)
      .then((r: any) => {
        if (r.rows.length > 0) {
          reject(new Error("Error removing review"));
          return;
        }
        resolve();
      })
      .catch((err: Error) => {
        reject(err);
      });
  });
};

export default removeReview;
