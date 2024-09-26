const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const url = require('url');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ noServer: true });

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
}));

const channels = {};
const monitoringClients = [];

app.get('/', (req, res) => {
    res.send('WebSocket server is running');
});

server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
    });
});

wss.on('connection', (ws, req) => {
    const queryParams = url.parse(req.url, true).query;
    const channel = queryParams.channels || 'public';
    const isMonitoring = queryParams.monitor;

    if (!channels[channel]) {
        channels[channel] = [];
    }

    if (isMonitoring) {
        monitoringClients.push(ws);
        console.log('A monitoring client connected');
    } else {
        channels[channel].push(ws);
        console.log(`A new client connected to channel: ${channel}`);
    }

    ws.send(`Welcome to the WebSocket server! You are in channel: ${channel}`);

    ws.on('message', (message) => {
        console.log(`Received on ${channel}: ${message}`);

        const messageObj = JSON.parse(message);
        const formattedMessage = JSON.stringify({ channel, ...messageObj });

        channels[channel].forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(formattedMessage);
            }
        });

        monitoringClients.forEach((monitorClient) => {
            if (monitorClient.readyState === WebSocket.OPEN) {
                monitorClient.send(formattedMessage);
            }
        });
    });

    ws.on('close', () => {
        console.log(`Client disconnected from channel: ${channel}`);
        channels[channel] = channels[channel].filter(client => client !== ws);
        if (channels[channel].length === 0) {
            delete channels[channel];
        }
    });
});

module.exports = server;
