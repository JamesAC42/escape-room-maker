import getMapReviews from "../dbActions/getMapReviews";
import { IReview } from "../interfaces/IMap";

// API endpoint for retrieving all the reviews for a given map
const getMapReviewsEndpoint = (req: any, res: any, db: any) => {
  // Get the id of the map that the users are being requested for
  const id = req.query.id;

  // Make sure the id was provided
  if (id === undefined) {
    res.send({ success: false });
    return;
  }

  // Ensure that the map is a valid uid
  if (
    !/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
      id
    )
  ) {
    res.send({ success: false });
    return;
  }

  // Get the map reviews
  getMapReviews(db, id)
    .then((reviews: Array<IReview>) => {
      // Send them back to the client
      res.send({ success: true, reviews });
      return;
    })
    .catch((err: Error) => {
      console.error(err);
      return;
    });
};

export default getMapReviewsEndpoint;
