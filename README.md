# Real-Time Messaging API with Multi-Channel & Server Monitoring

A real-time messaging API with multi-channel support and comprehensive server-side monitoring. Easily set up and integrate both server and client sides for seamless communication and tracking.

## Featured:

- Api Realtime Message
- Server Monitoring (All Message)
- Multi Channels

## Installation

**Server-Side**

```
git clone https://github.com/fitri-hy/websocket-message-api-nodejs.git
cd websocket-message-api-nodejs
npm Install
npm start
open localhost:3000
```

**Client-Side**

- Open Folder [Client-Side]
- Move to your Local Web Server Directory
- Run and Open

## API Usage

**API to retrieve Messages from All Channels**

```
ws://localhost:3000/?monitor=true
```

**API for Connecting to Server and Creating Channels**

```
ws://localhost:3000/api?channels={your_channel_name}
```