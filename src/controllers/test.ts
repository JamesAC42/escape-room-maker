const testReq = (req:any, res:any) => {

    console.log("Request for /testReq");
    res.send({
        hello:"world"
    });

}

export default testReq;