import addReview from "../dbActions/addReview";
import { IReviewDB } from "../interfaces/IMap";
const { v4: uuid } = require("uuid");

// API endpoint for adding a review to the database
const addReviewEndpoint = (req: any, res: any, db: any) => {

  // Unpack the data from the request
  const { mapId, rating, title, body } = req.body;

  // Make sure all the right fields were provided
  if (
    mapId === undefined ||
    rating === undefined ||
    title === undefined ||
    body === undefined
  ) {
    res.send({ success: false });
    return;
  }

  // Ensure that the map is a valid uid
  if (
    !/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
      mapId
    )
  ) {
    res.send({ success: false });
    return;
  }

  // Make sure the fields are all the right type
  if (
    typeof body !== "string" ||
    typeof title !== "string" ||
    typeof rating !== typeof 0
  ) {
    res.send({ success: false });
  }

  // Set bound limits on the text and integer values
  if (body.length > 5000 || title.length > 500 || rating < 1 || rating > 5) {
    res.send({ success: false });
    return;
  }

  // Make sure that the client has a valid session
  const userId = req.session.key;
  if (userId === undefined) {
    res.send({ success: false });
    return;
  }

  // Generate the data for the new review
  const reviewId = uuid();
  const reviewTimestamp = new Date();

  // Construct the review object that will go into the database
  const review: IReviewDB = {
    uid: reviewId,
    mapId,
    userId,
    rating,
    title,
    body,
    timestamp:new Date()
  };

  // Add the review into the database
  addReview(db, review)
    .then(() => {
      // Send the id and the timestamp of the review back to the client
      res.send({ 
        success: true, 
        id: reviewId, 
        timestamp: reviewTimestamp
      });
      return;
    })
    .catch((err: Error) => {
      console.error(err);
      return;
    });
};

export default addReviewEndpoint;
