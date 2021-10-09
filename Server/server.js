const
  { Server } = require("socket.io"),
  server = new Server(8000);

let
  sequenceNumberByClient = new Map();

server.on("connection", (socket) => {
  console.info(`Client connected [id=${socket.id}]`);
  server.emit('id', socket.id);
  sequenceNumberByClient.set(socket, 1);

  socket.on("disconnect", () => {
    sequenceNumberByClient.delete(socket);
    console.info(`Client gone [id=${socket.id}]`);
  });

  socket.on('data', (data) => {
    console.log(`Received data via [id=${socket.id}]: '${data}'`);
  });
});
