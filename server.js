const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Parse JSON data from the ESP8266
app.use(express.json()); 

// Serve the frontend webpage from a folder named 'public'
app.use(express.static('public')); 

// Endpoint to receive data from ESP8266
app.post('/api/update', (req, res) => {
    const temp = req.body.temperature;
    
    if (temp !== undefined) {
        console.log(`Received temperature: ${temp}°C`);
        // Broadcast the live temperature to any open web browsers
        io.emit('new_temperature', temp);
        res.status(200).send("OK");
    } else {
        res.status(400).send("Bad Request: Missing temperature data");
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Cloud server running on port ${PORT}`);
});
