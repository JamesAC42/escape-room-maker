import login from './controllers/login';
import register from './controllers/register';
import getUserInfo from './controllers/getUserInfo';
import destroySession from './controllers/destroySession';
import createMap from './controllers/createMap';
import getMap from './controllers/getMap';
import getAllMaps from './controllers/getAllMaps';
import getMyMaps from './controllers/getMyMaps';

const http = require('http');

class WebRouter {

    app:any;
    database:any;
    cache:any;
    port:number;

    constructor(app:any, db:any, c:any, port:number = 3501) {
        this.app = app;
        this.database = db;
        this.cache = c;
        this.port = port;

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

        this.app.get('/api/getMyMaps', (req:any, res:any) => {
            getMyMaps(req, res, this.database);
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
        
        const server = http.createServer(this.app);

        server.listen(this.port, () => {
            console.log(`Web server listening at port ${this.port}...`);
        });
    }

}

export default WebRouter;