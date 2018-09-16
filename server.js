const http = require('http');
const express = require('express');
const MessagingResponse = require('twilio').twiml.MessagingResponse;

const app = express();

var isSMSReceived = false;
var numSMSReceived = 0;
var lastSite = "";

app.post('/sms', (req, res) => {

  if(!isSMSReceived) {
    isSMSReceived = true;
  }
  numSMSReceived++;
  const MessagingResponse = require('twilio').twiml.MessagingResponse;
  const response = new MessagingResponse();
  const message = response.message();

  lastSite = response.toString());

  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
});

// a page for when this link is viewed
app.get('/sms', (req, res) => {
    if(isSMSReceived)
    {
      res.json({"message": "SMS Messages Received: " + numSMSReceived});
      console.log("lastSite");
    }
    else {
      res.json({"message": "Access Denied"});
    }
});

http.createServer(app).listen(process.env.PORT || 8080, () => {
  console.log('Express server listening on port' + (process.env.PORT || 8080));
});
