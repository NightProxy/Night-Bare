/* eslint-disable @typescript-eslint/no-var-requires */
const http = require('node:http');
const express = require('express')
const app = express()
const { createBareServer } = require('@tomphttp/bare-server-node');

const httpServer = http.createServer();

const bareServer = createBareServer('/bare');

httpServer.on('request', (req, res) => {
	if (bareServer.shouldRoute(req)) {
		bareServer.routeRequest(req, res);
	} else {
		res.writeHead(400);
		res.end('Not found.');
	}
});

httpServer.on('upgrade', (req, socket, head) => {
	if (bareServer.shouldRoute(req)) {
		bareServer.routeUpgrade(req, socket, head);
	} else {
		socket.end();
	}
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
  });

httpServer.on('listening', () => {
	console.log('Andromeda Bare server online');
});

httpServer.listen({
	port: 8080,
});
