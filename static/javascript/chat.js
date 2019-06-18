$(document).ready(() => {
    const socket = io();
    
    socket.on('connected', (data) => {
      console.log(data.log);
      console.log(data);
      let log = new Date();
      let time = log.toLocaleTimeString();
      let date = log.toLocaleDateString();

      $('#messages').append($('<li class="login">').text((`- User Connected: (${time} | ${date})`)));
    });

    socket.on('disconnected', (data) => {
        console.log(data.log);
        console.log(data);
        let log = new Date();
        let time = log.toLocaleTimeString();
        let date = log.toLocaleDateString();
  
        $('#messages').append($('<li class="logout">').text((`- User Disconnected: (${time} | ${date})`)));
    });
    
    socket.on('chat message', (data) =>{
        let log = new Date();
        let time = log.toLocaleTimeString();
        let date = log.toLocaleDateString();

        $('#messages').append($('<li>').text((`- ${data.msg} (${time} | ${date})`)));
    });

    $("#chatForm").submit((event) => {
        event.preventDefault(); // prevents page reloading
        socket.emit('chat message', $('#chatinput').val());
        $('#chatinput').val();
        return false;
      });

});