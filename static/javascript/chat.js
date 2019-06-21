$(document).ready(() => {
    const socket = io();

    socket.on('connected', (data) => {
      console.log(data.log);
      console.log(data);
      let log = new Date();
      let time = log.toLocaleTimeString();
      let date = log.toLocaleDateString();
      
      $('#messages').append($('<li class="login">')
      .text(`${data.username} has entered the room `)
      .append($('<span class="date">')
      .text(`(${time} | ${date})`)));
    });

    socket.on('user log', (data) => {
        console.log(data)
    });

    socket.on('disconnected', (data) => {
        let log = new Date();
        let time = log.toLocaleTimeString();
        let date = log.toLocaleDateString();
        console.log(data);
        console.log(data.log);
  
        $('#messages').append($('<li class="logout">')
        .text(`${data.username} has left the room `)
        .append($('<span class="date">')
        .text(`(${time} | ${date})`)));
    });
    
    socket.on('chat message', (data) =>{
        let log = new Date();
        let time = log.toLocaleTimeString();
        let date = log.toLocaleDateString();
        
        $('#messages').append($('<li>')
        .text((`- ${data.username} (${time} | ${date}): `))
        .append($('<span class="msg">').text(`${data.msg}`)));
    });

    $("#chatForm").submit((event) => {
        event.preventDefault();                             // Prevents page reloading
        socket.emit('chat message', $('#chatinput').val()); // Sends input value to server
        $('#chatinput').val('');                            // Resets input to empty string

        return false;
      });

});