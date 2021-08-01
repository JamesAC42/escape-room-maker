import login from './controllers/login'
import register from './controllers/register'
import getUserInfo from './controllers/getUserInfo'
import destroySession from './controllers/destroySession'
import createMap from './controllers/createMap'
import getMap from './controllers/getMap'
import getAllMaps from './controllers/getAllMaps'
import getMyMaps from './controllers/getMyMaps'
import addFavorite from './controllers/addFavorite'
import removeFavorite from './controllers/removeFavorite'

const http = require('http')

// The WebRouter class contains an express server, a database,
// a cache object, and a port. It is responsible for running the
// API server and routing requests to the proper controller functions
class WebRouter {
    app:any;
    database:any;
    cache:any;
    port:number;

    constructor (app:any, db:any, c:any, port:number = 3501) {
      this.app = app
      this.database = db
      this.cache = c
      this.port = port

      this.routeControllers()
    }

    // Bind the API endpoint URL to the current controller
    routeControllers () {
      this.app.get('/api/destroySession', destroySession)

      this.app.get('/api/getUserInfo', (req:any, res:any) => {
        getUserInfo(req, res, this.database)
      })

      this.app.get('/api/getMap', (req:any, res:any) => {
        getMap(req, res, this.database)
      })

      this.app.get('/api/getAllMaps', (req:any, res:any) => {
        getAllMaps(req, res, this.database)
      })

      this.app.get('/api/getMyMaps', (req:any, res:any) => {
        getMyMaps(req, res, this.database)
      })

      this.app.post('/api/login', (req: any, res: any) => {
        login(req, res, this.database)
      })

      this.app.post('/api/register', (req: any, res: any) => {
        register(req, res, this.database, this.cache)
      })

      this.app.post('/api/createMap', (req: any, res: any) => {
        createMap(req, res, this.database)
      })

      this.app.post('/api/addFavorite', (req: any, res: any) => {
        addFavorite(req, res, this.database)
      })

      this.app.post('/api/removeFavorite', (req: any, res: any) => {
        removeFavorite(req, res, this.database)
      })
    }

    // Create the server and listen on the specified port
    listen () {
      const server = http.createServer(this.app)

      server.listen(this.port, () => {
        console.log(`Web server listening at port ${this.port}...`)
      })
    }
}

export default WebRouter
