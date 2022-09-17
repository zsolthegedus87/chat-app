var socket = io();

var login = document.getElementById('login');
var username = document.getElementById('username');
var notifications = document.getElementById('notifications');
var messages = document.getElementById('messages');
var form = document.getElementById('form');
var input = document.getElementById('input');
var toastCell = document.getElementsByClassName('toast__cell')[0];

login.addEventListener('submit', function(e) {
    e.preventDefault();
    if (username.value) {
        socket.emit('new-user', username.value);
        notifications.textContent = 'You joined ' + username.value + '!';
        username.value = '';
        login.remove();
    }
});

form.addEventListener('submit', function(e) {
    e.preventDefault();
    if (input.value) {
        socket.emit('chat message', input.value);
        input.value = '';
    }
});

socket.on('chat message', function(msg) {
    let item = document.createElement('li');
    item.innerHTML = `<span class="name">${msg.name}:</span> ${msg.message}`;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
});

socket.on('user-connected', function(user) {
    let message = user + ' connected!';
    toastMessage(message, 'blue');
});

socket.on('user-disconnected', function(user) {
    let message = user + ' left!';
    toastMessage(message, 'yellow');
});


const toastMessage = function(message, type) {
    let toastItem = document.createElement('div');
    toastItem.classList.add('toast', `toast--${type}`);
    toastItem.innerHTML = `
        <div class="toast__icon">
            <svg version="1.1" class="toast__svg" xmlns="http://www.w3.org/2000/svg"
                 xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 32 32"
                 style="enable-background:new 0 0 32 32;" xml:space="preserve">
                <g>
                    <g id="info">
                        <g>
                            <path d="M10,16c1.105,0,2,0.895,2,2v8c0,1.105-0.895,2-2,2H8v4h16v-4h-1.992c-1.102,0-2-0.895-2-2L20,12H8     v4H10z"></path>
                            <circle cx="16" cy="4" r="4"></circle>
                        </g>
                    </g>
                </g>
            </svg>
        </div>
        <div class="toast__content">
            <p class="toast__type">${message}</p>
        </div>
    `;
    toastCell.appendChild(toastItem);

    setTimeout(() => {
        toastItem.classList.add('exit');
        setTimeout(() => {
            toastCell.removeChild(toastItem);
        }, "600")
    }, "7000")
}
