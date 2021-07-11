const express = require('express');
const bodyParser = require('body-parser');
const redis = require('redis');
const session = require('express-session');
const pg = require('pg');

const conInfo = require('../pw.json');
const config = require('../config.json');

const RedisStore = require('connect-redis')(session);
const redisClient = redis.createClient();

const conString = `postgres://${conInfo.username}:${conInfo.password}@localhost:5432/escaperoom`;
const client = new pg.Client(conString);
client.connect();

const app = express();

const _PORT = 3501;
const server = require('http').createServer(app);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

import login from './controllers/login';
import register from './controllers/register';
import getUserInfo from './controllers/getUserInfo';
import destroySession from './controllers/destroySession';
import createMap from './controllers/createMap';
import getMap from './controllers/getMap';

app.set('trust proxy', 1);
app.use(session({
    secret: 'rpiengineers',
    resave: true,
    name: 'escapesesh',
    proxy:true,
    saveUninitialized: true,
    cookie: { secure:config.secureSession },
    store: new RedisStore({ client: redisClient })
}));

app.get('/api/destroySession', destroySession);

app.get('/api/getUserInfo', (req:any, res:any) => {
    getUserInfo(req, res, client);
});

app.get('/api/getMap', (req:any, res:any) => {
    getMap(req, res, client);
});

app.post('/api/login', (req: any, res: any) => {
    console.log("testing");
    login(req, res, client);
});

app.post('/api/register', (req: any, res: any) => {
    register(req, res, client, redisClient);
});

app.post('/api/createMap', (req: any, res: any) => {
    createMap(req, res, client);
});

server.listen(_PORT, () => {
    console.log(`Web server listening at port ${_PORT}...`);
});