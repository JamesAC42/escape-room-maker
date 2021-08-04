/*
  Placeholder API endpoint for making sure the server is reachable
*/
const testReq = (req: any, res: any) => {
  console.log("Request for /testReq");
  res.send({
    hello: "world",
  });
};

export default testReq;
