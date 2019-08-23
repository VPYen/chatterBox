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
    let room = '';
    let time = log.toTimeString();
    let date = log.toLocaleDateString();
    let messages = [];
    socket['users'] = [];
    socket['username'] = 'ChattyPerson - '+ (socket.id).slice(0,4);
    
    // Log Users
    console.log(`ID: ${socket.id} connected: (${date} | ${time})`)
    console.log(socket.request.connection._peername);
    console.log("Number of users connected %s \n", socket.conn.server.clientsCount);   

    socket.on('new user', () => {
        updateUsers();
        // console.log('users', socket['users']);
        getUsers();
    });

    socket.on('edit user', data => {
        if(data.username !== '') {
            socket['username'] = data.username;
        }
        console.log(`ID: ${socket.id} changed username to ${socket.username}`);
        console.log();
        
        // Establish session with new user on connection
        io.emit('connected', { 
            date: date, 
            time: time,
            room: 'default',
            messages: messages,
            username: socket['username'],
            log: 'Connection established with server....', 
        });

        updateUsers();
        getUsers();
    });

    socket.on('disconnect', () => {
        log = new Date();
        time = log.toTimeString();
        date = log.toLocaleDateString();
        socket['users'].splice(socket['users'].indexOf(socket['username']), 1);

        console.log(`\n${socket['username']} disconnected: (${date} | ${time})`);
        console.log("Number of users connected %s", socket['users'].length)
        console.log();
        
        io.emit('disconnected', { 
            log: 'Disconnected from server....',
            username: socket['username'],
            date: date, 
            time: time,
            users: socket['users']
        });
    });

    socket.on('chat message', (msg) =>{
        log = new Date();
        time = log.toTimeString();
        date = log.toLocaleDateString();

        console.log(`${socket['username']} (${date} | ${time}): ${msg}`);
        
        // messages.append({username: username, date: date, time: time, msg: msg}); // throws runtime error
        io.emit('chat message', {
            msg: msg,
            username: socket['username'], 
        });
    });

    function updateUsers() {
        socket['users'] = [];
        for(let socketId in io.sockets.sockets) {
            socket['users'].push(io.sockets.sockets[socketId]['username']);
        };
    }

    function getUsers() {
        io.emit('get users', {users: socket['users'], room: room});
    }
});

http.listen(43511, () => {
    console.log('Listening on port: 43511 \n');
});
