/*

 */

import getUsername from "../dbActions/getUsername";
import { IMap } from "../interfaces/IMap";
import mapQueries from "../queries/mapQueries";
const { v4: uuid } = require('uuid');

const createMap = (req:any, res:any, db:any) => {

    const {
        title,
        description,
        tags,
        timeLimit,
        graph,
        explicit
    } = req.body;

    if(
        title === undefined ||
        description === undefined ||
        tags === undefined ||
        timeLimit === undefined ||
        graph === undefined ||
        explicit === undefined
    ) {
        res.send({success:false, prompt:'Invalid schema'});
        return;
    }
    
    const userid = req.session.key;
    if(userid === undefined) {
        res.send({success:false});
        return;
    }

    let now = new Date();
    let ratings:Array<any> = [];
    let times_completed:number = 0;

    let mapid = uuid();

    const query = {
        name: 'create-map',
        text: mapQueries.createMap,
        values: [
            mapid,
            userid,
            now,
            now,
            JSON.stringify(ratings),
            timeLimit,
            JSON.stringify(tags),
            description,
            title,
            explicit,
            times_completed,
            JSON.stringify(graph)
        ]
    };

    db.query(query)
    .then((r:any) => {
        if(r.rows.length > 0) {
            res.send({success:false});
        } else {
            res.send({
                success:true,
                id:mapid
            });
        }
    });


}

export default createMap;