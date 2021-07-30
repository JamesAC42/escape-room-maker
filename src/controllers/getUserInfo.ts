
import userQueries from '../queries/userQueries'

const getUserInfo = (req: any, res: any, db: any) => {
  console.log('Session requested...')
  console.log(`sessionID: ${req.session.id}`)
  console.log(`key: ${req.session.key}`)

  const userId = req.session.key
  if (userId === undefined) {
    res.send({ loggedout: true })
    return
  }

  const query = {
    name: 'get-user',
    text: userQueries.getUser,
    values: [userId]
  }

  db.query(query)
    .then((r: any) => {
      if (r.rows.length === 0) {
        req.session.destroy((err:any) => {
          res.send({ loggedout: true })
        })
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
        } = r.rows[0]

        if (admin === null) admin = false

        res.send({
          success: true,
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
      console.log(e)
      res.send({
        loggedout: true,
        success: false,
        error: 'User does not exist'
      })
    })
}

export default getUserInfo
