const roomForm = document.getElementById('room-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// get username and room from URL parameters

const queryString = window.location.search;
console.log(queryString);

const urlParams = new URLSearchParams(queryString);
// ?username=name&room=Gaming

const username = urlParams.get('username'); // username
const room = urlParams.get('room'); // room

// const { username, room } = 
//Qs.parse(location.search, {
//    ignoreQueryPrefix: true
//});

var socket = io();

// join chatroom
socket.emit('joinRoom-chat', { username, room });

// get room and users
socket.on('roomUsers', ({room, users}) => {
    outputRoomName(room);
    outputUsers(users);
});

// message from server
socket.on('message', message => {
    console.log(message);
    outputMessage(message);

    // scroll down to latest chat
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

// submit a message in chat
roomForm.addEventListener('submit', e => {
    e.preventDefault();
    
    // get message text
    let msg = e.target.elements.msg.value;

    msg = msg.trim();

    if (!msg) {
        return false;
    }
    
    // broadcast message to server
    socket.emit('chatMessage', msg);

    // clear input text for next input message and scroll down to latest message
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

// output message to DOM
function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message'); 
    /*
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
                     <p class="text">
                        ${message.text}
                     </p>`;
    */
    const p = document.createElement('p');
    p.classList.add('meta');
    p.innerText = message.username;
    p.innerHTML += `<span>${message.time}</span>`;
    div.appendChild(p);
    const para = document.createElement("p");
    para.classList.add("text");
    para.innerText = message.text;
    div.appendChild(para);
    document.querySelector('.chat-messages').appendChild(div);
}

// add room name to DOM
function outputRoomName(room) {
    roomName.innertText = room;
}

// add users to DOM
function outputUsers(users) {
   userList.innerHTML = '';
   users.ForEach(user => {
       const li = document.createElement('li');
       li.innerText = user.username;
       userList.appendChild(li);
   });
}