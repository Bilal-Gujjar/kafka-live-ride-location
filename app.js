// app.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const sendLocationUpdate = require('./kafka/producer');
const consumer = require('./kafka/consumer');
const cors = require('cors');

const app = express();
app.use(cors());
const server = http.createServer(app);
app.use(express.static('public'));
//server the index.html file
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
const io = socketIo(server);

app.use(express.json());
const LOCATION_TOPIC = 'location-updates';

// Endpoint for users to send location updates
app.post('/update-location', (req, res) => {
  const { userId, latitude, longitude } = req.body;
  if (!userId || !latitude || !longitude) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const locationData = { userId, latitude, longitude, timestamp: new Date() };
  sendLocationUpdate(LOCATION_TOPIC, locationData);
  res.status(200).json({ message: 'Location update sent successfully' });
});

// Kafka Consumer to receive location updates and broadcast to admin panel
consumer.on('message', (message) => {
  const locationData = JSON.parse(message.value);
  io.emit('locationUpdate', locationData); // Broadcast to all connected clients
});

io.on('connection', (socket) => {
  console.log('Admin connected to Socket.IO');
  socket.on('disconnect', () => console.log('Admin disconnected'));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
