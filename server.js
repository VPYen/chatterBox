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
    socket['username'] = 'ChattyPerson - '+ (socket.id).slice(0,4);
    
    // Log Users
    console.log(`${socket.username} connected: (${date} | ${time})`)
    console.log(socket.request.connection._peername);
    console.log("Number of users connected %s \n", socket.conn.server.clientsCount);   

    // Establish session with new user on connection
    io.emit('connected', { 
        username: socket.username,
        messages: messages,
        log: 'Connection established with server....', 
        date: date, 
        time: time
    });

    socket.on('new user', (data, callback) => {
        if(callback) {
            callback(true);
        }
        users = [];
        for(let socketId in io.sockets.sockets) {
            users.push(io.sockets.sockets[socketId]['username']);
        };
        console.log(users);
        getUsers();
    });

    socket.on('disconnect', () => {
        log = new Date();
        time = log.toTimeString();
        date = log.toLocaleDateString();
        users.splice(users.indexOf(socket.username), 1);
        
        console.log(`\n${socket.username} disconnected: (${date} | ${time})`);
        console.log("Number of users connected %s", users.length)
        console.log();
        
        io.emit('disconnected', { 
            log: 'Disconnected from server....',
            username: socket.username,
            date: date, 
            time: time,
            users: users
        });
    });

    socket.on('chat message', (msg) =>{
        log = new Date();
        time = log.toTimeString();
        date = log.toLocaleDateString();

        console.log(`${socket.username} (${date} | ${time}): ${msg}`);
        
        // messages.append({username: username, date: date, time: time, msg: msg}); // throws runtime error
        io.emit('chat message', {
            msg: msg,
            username: socket.username, 
        });
    });

    function getUsers() {
        io.emit('get users', users);
    }
});

http.listen(43511, () => {
    console.log('Listening on port: 43511 \n');
});
