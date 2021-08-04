/*
  Ends the current session; called when a user logs out
 */
const destroySession = (req: any, res: any) => {
  req.session.destroy((err: Error) => {
    if (err) {
      console.error(err);
      console.log(`Error destroying session: ${req.session.key}`);
    }
    res.send({ success: true });
  });
};

export default destroySession;
