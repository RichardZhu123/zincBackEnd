const http = require('http');
const express = require('express');
const MessagingResponse = require('twilio').twiml.MessagingResponse;

const app = express();

app.post('/sms', (req, res) => {
  console.log('Message Received');
});

// a page for when this link is viewed
app.get('/sms', (req, res) => {
    res.json({"message": "Hiiii"});
});

http.createServer(app).listen(process.env.PORT || 8080, () => {
  console.log('Express server listening on port' + (process.env.PORT || 8080));
});
