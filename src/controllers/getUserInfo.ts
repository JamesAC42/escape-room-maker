/*
  retrieves user data for a user with a given id
  used by the query getUser in userQueries.ts
 */

import userQueries from '../queries/userQueries';

const getUserInfo = (req: any, res: any, db: any) => {
    
    console.log("Session requested...");
    console.log(`sessionID: ${req.session.id}`);
    console.log(`key: ${req.session.key}`);

    // check if the user is logged out
    const userId = req.session.key;
    if(userId === undefined) {
        res.send({loggedout: true});
        return;
    }

    // make a getUser query
    const query = {
        name: 'get-user',
        text: userQueries.getUser,
        values: [userId]
    }

    db.query(query)
        .then((r: any) => {
            if(r.rows.length === 0) {
                req.session.destroy((err:any) => {
                    res.send({loggedout:true});
                    return;
                })
            } else { // get the user info from the database
                let {
                    username,
                    email,
                    creation_date,
                    dob,
                    verified,
                    display_name,
                    admin,
                    rated,
                    settings,
                    played,
                    favorites
                } = r.rows[0];

                if(admin === null) admin = false;
                
                res.send({
                    success:true,
                    loggedout: false,
                    username,
                    email,
                    uid: userId,
                    creation_date: new Date(creation_date),
                    dob: new Date(dob),
                    verified,
                    display_name,
                    admin,
                    rated: JSON.parse(rated),
                    settings: JSON.parse(settings),
                    played: JSON.parse(played),
                    favorites: JSON.parse(favorites)
                })                
            }
        })
        .catch((e: any) => {
            console.log(e);
            res.send({
                loggedout:true,
                success:false,
                error: 'User does not exist'
            })
        })
}

export default getUserInfo;