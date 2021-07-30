const userQueries = {
  createUser: 'INSERT INTO users(uid, username, password, email, creation_date, dob, verified, display_name, admin, rated, settings, played, favorites) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)',
  findUserByEmail: 'SELECT username, uid, password FROM users WHERE email = $1',
  findUser: 'SELECT uid FROM users WHERE username = $1',
  findEmail: 'SELECT uid FROM users WHERE email = $1',
  getUser: 'SELECT username, email, creation_date, dob, verified, display_name, admin, rated, settings, played, favorites FROM users WHERE uid = $1',
  getUsername: 'SELECT username FROM users WHERE uid = $1'
}

export default userQueries
