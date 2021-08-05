import { IReview } from "../interfaces/IMap";
import reviewQueries from "../queries/reviewQueries";

// Makes a SQL query to get all reviews pertaining to a given map
const getMapReviews = (db: any, mapid: string): Promise<Array<IReview>> => {
  return new Promise((resolve: any, reject: any) => {

    // Construct the query
    const query = {
      name: "get-map-reviews",
      text: reviewQueries.getMapReviews,
      values: [mapid],
    };

    // Execute the query and resolve the data
    db.query(query)
      .then((r: any) => {
        resolve(r.rows);
      })
      .catch((err: Error) => {
        reject(err);
      });
  });
};

export default getMapReviews;
