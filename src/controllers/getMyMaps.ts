import getUserMaps from "../dbActions/getUserMaps";

const getMyMaps = (req: any, res: any, db: any) => {
  const userid = req.session.key;
  if (userid === undefined) {
    res.send({ success: false });
    return;
  }

  getUserMaps(db, userid)
    .then((maps: Array<any>) => {
      res.send({
        success: true,
        maps,
      });
    })
    .catch((err: any) => {
      console.error(err);
      res.end({ success: false });
    });
};

export default getMyMaps;
