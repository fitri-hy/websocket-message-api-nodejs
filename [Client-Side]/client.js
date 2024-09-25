const channel = 'myChannel';
const ws = new WebSocket(`ws://localhost:3000/api?channels=${channel}`);

const messagesDiv = document.getElementById('messages');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const usernameInput = document.getElementById('username');

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
    const message = messageInput.value.trim();
    const username = usernameInput.value || 'Anonymous';
    if (message) {
        ws.send(JSON.stringify({ sender: username, message }));
        messageInput.value = '';
    }
});

const displayMessage = ({ sender, message }) => {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message';
    messageDiv.textContent = `${sender}: ${message}`;
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
};
