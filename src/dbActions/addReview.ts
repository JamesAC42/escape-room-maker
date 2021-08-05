import { IReviewDB } from "../interfaces/IMap";
import reviewQueries from "../queries/reviewQueries";

// Inserts a review into the database
const addReview = (db: any, review: IReviewDB): Promise<any> => {
  return new Promise((resolve: any, reject: any) => {
    // Construct the query from the review object data
    const query = {
      name: "insert-review",
      text: reviewQueries.addReview,
      values: [
        review.uid,
        review.mapId,
        review.userId,
        review.rating,
        review.title,
        review.body,
        review.timestamp,
      ],
    };

    // Execute the query
    db.query(query).then((r: any) => {
      if (r.rows.length > 0) {
        reject(new Error("Error inserting new review"));
        return;
      }
      resolve();
    });
  });
};

export default addReview;
