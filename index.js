const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/client.js', (req, res) => {
  res.sendFile(__dirname + '/client.js');
});

app.get('/styles.css', (req, res) => {
  res.sendFile(__dirname + '/styles.css');
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});

const users = {};

io.on('connection', (socket) => {
  socket.on('chat message', msg => {
    io.emit('chat message', { message: msg, name: users[socket.id] });
  });

  socket.on('new-user', name => {
    users[socket.id] = name;
    socket.broadcast.emit('user-connected', name)
  });

  socket.on('disconnect', name => {
    socket.broadcast.emit('user-disconnected', users[socket.id])
    delete users[socket.id]
  });
});
