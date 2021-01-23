const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// set static folder
app.use(express.static(path.join(__dirname, 'public')));

// run when client connects
io.on('connection', socket => {
  console.log("Establishing new WebSocket connection...");

  // automatic message upon loading or reloading page
  socket.emit("message", "Welcome to Yoga Remastered: C&C!");

  // broadcast when a user connects
  // does not broadcast to user entering room
  socket.broadcast.emit("message", "A user has joined the room");

  // run when client disconnects
  socket.on("disconnect", () => {
    io.emit("message", "A user has left the room");
  });

  // listen for chat message
  socket.on("chatMessage", (msg) => {
    io.emit('message', msg);
  });
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));