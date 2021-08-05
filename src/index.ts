// The main entry point of the server process. Creates the
// clients for the cache, the database, instantiates the express server and
// passes it to the WebRouter to handle connections

const express = require("express");
const bodyParser = require("body-parser");
const redis = require("redis");
const session = require("express-session");
const pg = require("pg");

const conInfo = require("../pw.json");
const config = require("../config.json");
const redisPw = require("../redisPw.json");

const RedisStore = require("connect-redis")(session);
const redisClient = redis.createClient();

redisClient.auth(redisPw.pw);

import WebRouter from "./WebRouter";

const conString = `postgres://${conInfo.username}:${conInfo.password}@localhost:5432/escaperoom`;
const client = new pg.Client(conString);
client.connect();

// Create the express server
const app = express();

// Adding some middleware to handle request body and
// sessions
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set("trust proxy", 1);
app.use(
  session({
    secret: "rpiengineers",
    resave: true,
    name: "escapesesh",
    proxy: true,
    saveUninitialized: true,
    cookie: { secure: config.secureSession },
    store: new RedisStore({ client: redisClient }),
  })
);

// Create a WebRouter and listen for requests
const wr = new WebRouter(app, client, redisClient);
wr.listen();
