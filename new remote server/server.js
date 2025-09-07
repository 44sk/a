// server.js
const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8080 }, () => {
  console.log("WebSocket server running on ws://10.101.70.186:8080");
});

wss.on("connection", (ws) => {
  console.log("New client connected");

  ws.on("message", (msg) => {
    // Broadcast to all clients except sender
    wss.clients.forEach(client => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(msg);
      }
    });
  });

  ws.on("close", () => console.log("Client disconnected"));
});

// Keep-alive heartbeat every 30s
setInterval(() => {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type: "heartbeat" }));
    }
  });
}, 30000);
