const http = require('http');
const https = require('https');
const express = require('express');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const bodyParser = require("body-parser");
const accountSid = 'AC656119bfe88b16fbd15c1a28d4bc92bc';
const authToken = 'c7db194a5706e18b5eee3ddafb25287d';
const client = require('twilio')(accountSid, authToken);

const app = express();

var isSMSReceived = false;
var numSMSReceived = 0;
var currSite = '';
var originPhoneNum = '';

var statusCode2;
var headers2;


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

  currSite = req.body.Body;
  originPhoneNum = req.body.From;

  var body2;
  var body3 = '';

  if(currSite.charAt(4) == ('s'))
  {
    // Send a GET request to the site
    https.get(currSite, (res2) => {
      //console.log('statusCode:', res2.statusCode);
      //console.log('headers:', res2.headers);

      statusCode2 = res2.statusCode;
      headers2 = res2.headers;

      res2.on('data', (d) => {
        //body2 += d;
        //body3 = d;
        body3 = d.toString();
      });

    }).on('error', (e) => {
      console.error(e);
    }).on('end', () => {
      // body2 = Buffer.concat(body2).toString();
      // At this point, we have the headers, method, url and body, and can now
      // do whatever we need to in order to respond to this request.
    });
  }
  else {
    // Send a GET request to the site
    http.get(currSite, (res2) => {
      //console.log('statusCode:', res2.statusCode);
      //console.log('headers:', res2.headers);

      statusCode2 = res2.statusCode;
      headers2 = res2.headers;

      res2.on('data', (d) => {
        //body2 += d;
        var buf1 = Buffer.from(body3);
        var buf2 = Buffer.from(d);
        var arr = [buf1, buf2];
        body3 = Buffer.concat(arr);
        console.log(typeof d);
      });

    }).on('error', (e) => {
      console.error(e);
    }).on('end', () => {
      // body2 = Buffer.concat(body2).toString();
      // At this point, we have the headers, method, url and body, and can now
      // do whatever we need to in order to respond to this request.
    });
  }

  client.messages
    .create({
       body: 'hi',
       from: '+16476916089',
       to: originPhoneNum
     })
    .then(message => console.log(message.sid))
    .done();

  console.log(body3.toString());

  res.writeHead(200, {'Content-Type': 'text/xml'});
  //res.end(body3.toString());
  //res.end(twiml.toString());
  res.end();
});

// a page for when this link is viewed
app.get('/sms', (req, res) => {
    if(isSMSReceived)
    {
      res.json({
        "message": "SMS Messages Received: " + numSMSReceived,
        "lastSite": originPhoneNum
      });
    }
    else {
      res.json({"message": "Access Denied"});
    }
});

/** production
http.createServer(app).listen(8080, () => {
  console.log('Express server listening on port ' + 8080);
}); */

/** deployment */
http.createServer(app).listen(process.env.PORT || 8080, () => {
  console.log('Express server listening on port ' + (process.env.PORT || 8080));
});
