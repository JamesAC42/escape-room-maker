const express = require('express');
const bodyParser = require('body-parser');
const redis = require('redis');

const app = express();

const _PORT = 3501;
const server = require('http').createServer(app);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

import testReq from './controllers/test';

app.get('/api/testReq', (req:any, res:any) => {
    testReq(req, res);
});

server.listen(_PORT, () => {
    console.log(`Web server listening at port ${_PORT}...`);
});