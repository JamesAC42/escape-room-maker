import userQueries from '../queries/userQueries'
const bcrypt = require('bcrypt')

const login = (req: any, res: any, db: any) => {
  const {
    email,
    password
  } = req.body

  if (email === undefined ||
        password === undefined) {
    res.send({
      success: false,
      error: 'Invalid schema'
    })
    return
  }

  const query = {
    name: 'find-user-login',
    text: userQueries.findUserByEmail,
    values: [email]
  }

  db.query(query)
    .then((r: any) => {
      if (r.rows.length === 0) {
        res.send({
          success: false,
          error: 'User does not exist'
        })
      } else {
        const pw = r.rows[0].password

        bcrypt.compare(password, pw, (err:any, result:boolean) => {
          if (result) {
            req.session.key = r.rows[0].uid
            const userdataquery = {
              name: 'login-data',
              text: userQueries.getUser,
              values: [r.rows[0].uid]
            }

            db.query(userdataquery)
              .then((datar: any) => {
                if (datar.rows.length === 0) {
                  throw new Error('Invalid user')
                } else {
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
                  } = datar.rows[0]

                  if (admin === null) admin = false

                  res.send({
                    success: true,
                    loggedout: false,
                    username,
                    email,
                    uid: r.rows[0].uid,
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
                console.log(e)
                res.send({
                  success: false,
                  error: 'User does not exist'
                })
              })
          } else {
            res.send({
              success: false,
              error: 'Password was incorrect'
            })
          }
        })
      }
    })
    .catch((e: any) => {
      console.log('asdf')
      console.log(e)
      res.send({
        success: false,
        error: 'User does not exist'
      })
    })
}

export default login
