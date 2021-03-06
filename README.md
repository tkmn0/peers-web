# Peers Client
Peers - WebRTC full mesh implementation.
This is full mesh topology WebRTC library for client.
This library forcus on handling of WebRTC.

## Links
- [Demo](https://npeers.herokuapp.com/) is running on heroku.
- [peers-server](https://github.com/tkmn0/peers-server) - peers client side library
- examples
    - [peers client example vue](https://github.com/tkmn0/peers-web-example-vue) - written in Vue.js
    - [Demo Source Code](https://github.com/tkmn0/peers-server-example-express-typescript) - run with express written in Typescript. included web app (written in vue.js).

## Features
- Room
- MediaStatus handling
- Signaling Handling
- 100% Written in Typescript
- Built with webpack you can use this library for Typescript and javascript both.
- Linted
- Simple API
- Embed Logger

## Dependencies
- socket.io
- socket.io-client

## Installation
`npm install peers-web`

## How to use
```
import Peers from "peers-web";
const peers = new Peers();

// setup log level
peers.setLogLevel("info");

// setup uri
const uri = "YOUR_PEERS_SERVER_ADDRESS";
peers.setupConnection(uri);

// setup local stream
const constraints = {
    width: { min: 320, ideal: 320, max: 640 },
    height: { ideal: 360 },
    video: true,
    audio: true,
    facingMode: { exact: "user" }
};

const localStream = await navigator.mediaDevices.getUserMedia(constraints);
peers.addLocalStram(localStream);

// join Room
const roomId = "YOUR_EXITING_ROOM_ID";
peers.joinRoom(roomId); // if roomId is empty, room and roomId will be created on server side.

// toggle mute/unmute local Video
peers.toggleLocalVideoMute();

// toggle mute/unmute local Audio
peers.toggleLocalAudioMute();
```

access to properties
```
// get local stream
peers.LocalStream()

// get is room joined
peers.RoomJoined()

// get media models
peers.MediaModels()
```
MediaModel includes stream and stram info(video/audio is mute) include local and remotes.
Number of MediaModels is number of participants (include local).
MediaModel.isLocal means local.