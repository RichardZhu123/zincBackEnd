const http = require('http');
const express = require('express');
const MessagingResponse = require('twilio').twiml.MessagingResponse;

const app = express();

var isSMSReceived = false;
var numSMSReceived = 0;
var lastSite = "";

/** bodyParser.urlencoded(options)
 * Parses the text as URL encoded data (which is how browsers tend to send form data from regular forms set to POST)
 * and exposes the resulting object (containing the keys and values) on req.body
 */
app.use(bodyParser.urlencoded({
    extended: true
}));

/**bodyParser.json(options)
 * Parses the text as JSON and exposes the resulting object on req.body.
 */
app.use(bodyParser.json());

app.post('/sms', (req, res) => {

  if(!isSMSReceived) {
    isSMSReceived = true;
  }
  numSMSReceived++;

  //lastSite = req.message().toString());

  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
});

// a page for when this link is viewed
app.get('/sms', (req, res) => {
    if(isSMSReceived)
    {
      res.json({"message": "SMS Messages Received: " + numSMSReceived});
      res.json({"message": "lastSite: " + lastSite});
    }
    else {
      res.json({"message": "Access Denied"});
    }
});

http.createServer(app).listen(process.env.PORT || 8080, () => {
  console.log('Express server listening on port' + (process.env.PORT || 8080));
});
