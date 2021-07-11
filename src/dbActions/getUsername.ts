import userQueries from "../queries/userQueries"

const getUsername = (db:any, userid:string):Promise<string> => {

    return new Promise((resolve:any, reject:any) => {
        const query = {
            name: 'get-username',
            text: userQueries.getUsername,
            values: [userid]
        };
    
        db.query(query)
        .then((r:any) => {
            if(r.rows.length === 0) {
                reject("Invalid user id");
            } else {
                resolve(r.rows[0].username);
            }
        })
    })
}

export default getUsername;