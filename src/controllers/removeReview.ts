import getReview from "../dbActions/getReview";
import removeReview from "../dbActions/removeReview";

// API endpoint for removing a review from the database
const removeReviewEndpoint = (req:any, res:any, db:any) => {

  // Make sure that the client has a valid session
  const userId = req.session.key;
  if (userId === undefined) {
    res.send({ success: false });
    return;
  }

  // Get the UID of the review to be removed
  const {
    uid
  } = req.body;
  
  // Ensure that the id is a valid uid
  if (
    !/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
      uid
    )
  ) {
    res.send({ success: false });
    return;
  }

  // Retrieve the review from the database
  getReview(db, uid)
  .then((review:any) => {

    // Make sure that the author of the review and the 
    // client requesting to delete it match
    if(review.userid !== userId) {
      res.send({success:false});
      return;
    }

    // Remove the review
    removeReview(db, uid)
    .then(() => {

      // Tell the client the result
      res.send({success:true});
      return;
    })
    .catch((err:Error) => {
      console.error(err);
      res.send({success:false});
    })

  })
  .catch((err:Error) => {
    console.error(err);
    res.send({success:false});
    return;
  })


}

export default removeReviewEndpoint;