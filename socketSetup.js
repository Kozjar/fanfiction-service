const socket = require('socket.io');

const createSocketConnection = (server) => {
  const io = socket(server);

  io.on('connection', (socket) => {
    console.log(`made socket connection: ${socket.id}`);

    socket.on('disconnect', () => {
      console.log('user disconnected')
    });

    socket.on("join", async room => {
      socket.join(room);
      console.log(`joined to room: ${room}`);
      io.emit("roomJoined", room);
    });

    socket.on('leave', room => {
      socket.leave(room);
      console.log(`some user leave room: ${room}`);
    })

    socket.on('comment', data => {
      console.log(data);
      io.to(data.room).emit('newComment', {
        userName: data.userName, text: data.text
      });
    })
  })
}

module.exports = createSocketConnection;