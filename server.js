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
    let login = new Date();
    let time = login.toTimeString();
    let date = login.toLocaleDateString();

    console.log(`A user connected: (${date} | ${time})`)
    
    io.emit('connected', { log: 'Connection established with server....', date: date, time: time });

    socket.on('disconnect', () => {
        let logout = new Date();
        let time = logout.toTimeString();
        let date = logout.toLocaleDateString();
        console.log(`A user disconnected: (${date} | ${time})`);
        io.emit('disconnected', { log: 'Disconnected from server....', date: date, time: time });
    });

    socket.on('chat message', (msg) =>{
        console.log('message: ' + msg);
        io.emit('chat message', { msg: msg });
    });
});


http.listen(43511, () => {
    console.log('Listening on port: 43511');
});
