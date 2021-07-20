const express = require('express');
const bodyParser = require('body-parser');
const redis = require('redis');
const session = require('express-session');
const pg = require('pg');

const conInfo = require('../pw.json');
const config = require('../config.json');

const RedisStore = require('connect-redis')(session);
const redisClient = redis.createClient();

import WebRouter from './WebRouter';

const conString = `postgres://${conInfo.username}:${conInfo.password}@localhost:5432/escaperoom`;
const client = new pg.Client(conString);
client.connect();

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

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

const wr = new WebRouter(app, client, redisClient);
wr.listen();