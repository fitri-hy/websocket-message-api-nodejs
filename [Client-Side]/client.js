const channel = 'myChannel';
const ws = new WebSocket(`ws://localhost:3000/api?channels=${channel}`);

const messagesDiv = document.getElementById('messages');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const usernameInput = document.getElementById('username');

const usedUsernames = new Set();

const generateUniqueUsername = () => {
    let username;
    do {
        const randomNumber = Math.floor(Math.random() * 100000);
        username = `guest-${randomNumber.toString().padStart(5, '0')}`;
    } while (usedUsernames.has(username));
    usedUsernames.add(username);
    return username;
};

const setUsername = () => {
    const username = usernameInput.value.trim();
    if (!username) {
        const uniqueUsername = generateUniqueUsername();
        usernameInput.value = uniqueUsername;
    }
};

ws.onopen = () => console.log('Connected to WebSocket server');

ws.onmessage = (event) => {
    const reader = event.data instanceof Blob ? new FileReader() : null;
    if (reader) {
        reader.onload = (e) => displayMessage(JSON.parse(e.target.result));
        reader.readAsText(event.data);
    } else {
        displayMessage(JSON.parse(event.data));
    }
};

ws.onclose = () => console.log('Disconnected from WebSocket server');

sendButton.addEventListener('click', () => {
    setUsername();
    const message = messageInput.value.trim();
    const username = usernameInput.value;
    if (message) {
        ws.send(JSON.stringify({ sender: username, message }));
        messageInput.value = ''; 
    }
});

const displayMessage = ({ sender, message }) => {
    const messageDiv = document.createElement('div');
    const isSender = (usernameInput.value || 'Anonymous') === sender;

    messageDiv.className = `flex ${isSender ? 'justify-end' : 'justify-start'}`;

    const bubbleDiv = document.createElement('div');
    bubbleDiv.className = `rounded-lg p-2 max-w-xs text-white ${isSender ? 'bg-blue-500' : 'bg-gray-500'}`;
    bubbleDiv.innerHTML = `<strong>${sender}</strong><br>${message}`;

    messageDiv.appendChild(bubbleDiv);
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
};

window.onload = () => {
    if (!usernameInput.value.trim()) {
        usernameInput.value = generateUniqueUsername();
    }
};
