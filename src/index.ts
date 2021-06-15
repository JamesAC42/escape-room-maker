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

import testReq from './controllers/test';

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

app.get('/api/testReq', (req:any, res:any) => {
    testReq(req, res);
});

server.listen(_PORT, () => {
    console.log(`Web server listening at port ${_PORT}...`);
});