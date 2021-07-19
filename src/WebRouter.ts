import login from './controllers/login';
import register from './controllers/register';
import getUserInfo from './controllers/getUserInfo';
import destroySession from './controllers/destroySession';
import createMap from './controllers/createMap';
import getMap from './controllers/getMap';
import getAllMaps from './controllers/getAllMaps';

class WebRouter {

    app:any;
    database:any;
    cache:any;

    constructor(a:any, db:any, c:any) {
        this.app = a;
        this.database = db;
        this.cache = c;

        this.routeControllers();
    }

    routeControllers() {
        
        this.app.get('/api/destroySession', destroySession);

        this.app.get('/api/getUserInfo', (req:any, res:any) => {
            getUserInfo(req, res, this.database);
        });

        this.app.get('/api/getMap', (req:any, res:any) => {
            getMap(req, res, this.database);
        });

        this.app.get('/api/getAllMaps', (req:any, res:any) => {
            getAllMaps(req, res, this.database);
        });

        this.app.post('/api/login', (req: any, res: any) => {
            login(req, res, this.database);
        });

        this.app.post('/api/register', (req: any, res: any) => {
            register(req, res, this.database, this.cache);
        });

        this.app.post('/api/createMap', (req: any, res: any) => {
            createMap(req, res, this.database);
        });
    }

    listen() {
        
        const _PORT = 3501;
        const server = require('http').createServer(this.app);

        server.listen(_PORT, () => {
            console.log(`Web server listening at port ${_PORT}...`);
        });
    }

}

export default WebRouter;