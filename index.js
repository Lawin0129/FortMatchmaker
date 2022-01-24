const WebSocket = require('ws').Server;
const Server = '[SERVER]';
const crypto = require("crypto");

// Start listening websocket on port
const port = 80;
const wss = new WebSocket({ port: port }, console.log(Server, "Matchmaker started listening on port", port));

wss.on('connection', async (ws) => {
    if (ws.protocol.toLowerCase().includes("xmpp")) {
        return ws.close();
    }

    // create hashes
    const ticketId = crypto.createHash('md5').update(`1${Date.now()}`).digest('hex');
    const matchId = crypto.createHash('md5').update(`2${Date.now()}`).digest('hex');
    const sessionId = crypto.createHash('md5').update(`3${Date.now()}`).digest('hex');

    // you can use setTimeout to send the websocket messages at certain times
    Connecting();
    Waiting();
    Queued();
    SessionAssignment();
    setTimeout(Join, 2000);

    function Connecting() {
        ws.send(JSON.stringify({
            "payload": {
                "state": "Connecting"
            },
            "name": "StatusUpdate"
        }));
    }

    function Waiting() {
        ws.send(JSON.stringify({
            "payload": {
                "totalPlayers": 1,
                "connectedPlayers": 1,
                "state": "Waiting"
            },
            "name": "StatusUpdate"
        }));
    }

    function Queued() {
        ws.send(JSON.stringify({
            "payload": {
                "ticketId": ticketId,
                "queuedPlayers": 0,
                "estimatedWaitSec": 0,
                "status": {},
                "state": "Queued"
            },
            "name": "StatusUpdate"
        }));
    }

    function SessionAssignment() {
        ws.send(JSON.stringify({
            "payload": {
                "matchId": matchId,
                "state": "SessionAssignment"
            },
            "name": "StatusUpdate"
        }));
    }

    function Join() {
        ws.send(JSON.stringify({
            "payload": {
                "matchId": matchId,
                "sessionId": sessionId,
                "joinDelaySec": 1
            },
            "name": "Play"
        }));
    }

    ws.on('message', function incoming(message) {
        console.log(Server, 'A client sent a message:', message);
    });
});
