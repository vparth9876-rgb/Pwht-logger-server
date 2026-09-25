const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Middleware to parse incoming JSON from the ESP32
app.use(express.json());

// Serve the frontend files from the "public" folder
app.use(express.static('public'));

// Endpoint for the ESP32 to POST data to
app.post('/api/update', (req, res) => {
    const data = req.body;
    
    // Broadcast the exact data directly to the web dashboard
    if (data && data.temperatures) {
        io.emit('updateData', data);
        res.status(200).send('Data received and broadcasted');
    } else {
        res.status(400).send('Invalid data format');
    }
});

// Start the server (Render provides the PORT automatically)
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Cloud Server running on port ${PORT}`);
});
