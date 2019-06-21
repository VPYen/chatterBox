const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static(__dirname + "/static"));
app.set("views", __dirname + "/static/views");
app.set("view engine", "ejs");

app.get('/', (req, res) => {
    res.render('index');
});

io.on('connection', (socket) => {
    let log = new Date();
    let time = log.toTimeString();
    let date = log.toLocaleDateString();
    let users = [];
    let messages = [];
    let username = 'ChattyPerson' + socket.conn.server.clientsCount;
    
    // Log Users
    console.log(username);
    console.log(`A user connected: (${date} | ${time})`)
    console.log(socket.request.connection._peername);
    console.log();

    // Establish session with new user on connection
    io.emit('connected', { 
        messages: messages,
        username: username, 
        log: 'Connection established with server....', 
        date: date, 
        time: time
    });

    io.emit('user log', {
        users: users
    });

    socket.on('user log', (data) => {
        console.log(data);
    });

    socket.on('disconnect', () => {
        log = new Date();
        time = log.toTimeString();
        date = log.toLocaleDateString();

        console.log(`A user disconnected: (${date} | ${time})`);

        io.emit('disconnected', { 
            log: 'Disconnected from server....',
            username: username,
            date: date, 
            time: time 
        });
    });

    socket.on('chat message', (msg) =>{
        log = new Date();
        time = log.toTimeString();
        date = log.toLocaleDateString();

        console.log(`${username} (${date} | ${time}): ${msg}`);

        io.emit('chat message', {
            msg: msg,
            username: username, 
        });
    });
});


http.listen(43511, () => {
    console.log('Listening on port: 43511 \n');
});
