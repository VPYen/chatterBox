$(document).ready(() => {
    const socket = io();
    let room = '';
    let userImg = '../images/blankTransProfile.png';
    let $userList = $('#userList');
    let $chatContainer = $('#chatContainer');
    let $loginContainer = $('#loginContainer');
    $chatContainer.hide();  

    function updateUsers(users) {
      let userList = '';
      console.log(users);
      for(let i = 0; i < users.length; i++) {
        userList += `<li class='user' id=${users[i]}><img class="userImg" alt=" " src="${userImg}" />${users[i]}</li>`
      }
      $userList.html(userList);
    }
    
    function editUser(username, room) {
      socket.emit('edit user', {username: username, room: room});
    }

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
      
      socket.emit('new user', data.username);
    });

    socket.on('get users', data => {
      room = data.room;
      updateUsers(data.users);
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

        updateUsers(data.users);
    });
    
    socket.on('chat message', (data) =>{
        let log = new Date();
        let time = log.toLocaleTimeString();
        let date = log.toLocaleDateString();
        
        $('#messages').append($('<li>')
        .append($(`<img class="userImg" alt=" " src="${userImg}"/>`))
        .text(`${data.username} `)
        .append($('<span class="date">').text(`(${time} | ${date}): `)
        .append($('<span class="msg">').text(`${data.msg}`))));
    });

    $("#chatForm").submit((event) => {
        event.preventDefault();                             // Prevents page reloading
        socket.emit('chat message', $('#chatinput').val()); // Sends input value to server
        $('#chatinput').val('');                            // Resets input to empty string

        return false;
      });

      
    $("#loginForm").submit((event) => {
      event.preventDefault();                                 // Prevents page reloading
      // console.log($('#username').val());
      editUser($('#username').val());       // Sends input value to server
      $loginContainer.hide();
      $chatContainer.show();

      return false;
    });

});