var HTTPS = require('https');
var cool = require('cool-ascii-faces');
var counter = require('count');
var botID = process.env.BOT_ID;
var fs = require('fs');

var count;

fs.readFile('./count', function(err, data) {
  if(err) {
    return console.log(err);
  }
  count = data;
  console.log(data);
});

function respond() {
  var request = JSON.parse(this.req.chunks[0]),
      botRegex = /^Trish\+\+$/im;

  if(request.text && botRegex.test(request.text)) {
    this.res.writeHead(200);
    count++;
    postMessage();
    this.res.end();
  } else {
    console.log("don't care" + request.text);
    this.res.writeHead(200);
    this.res.end();
  }
}

function postMessage() {
  var botResponse, options, body, botReq;

  botResponse = "The Trish LMAO count is now at " + str(count);

  options = {
    hostname: 'api.groupme.com',
    path: '/v3/bots/post',
    method: 'POST'
  };

  body = {
    "bot_id" : botID,
    "text" : botResponse
  };

  console.log('sending ' + botResponse + ' to ' + botID);

  botReq = HTTPS.request(options, function(res) {
      if(res.statusCode == 202) {
        //neat
      } else {
        console.log('rejecting bad status code ' + res.statusCode);
      }
  });

  botReq.on('error', function(err) {
    console.log('error posting message '  + JSON.stringify(err));
  });
  botReq.on('timeout', function(err) {
    console.log('timeout posting message '  + JSON.stringify(err));
  });
  botReq.end(JSON.stringify(body));
}


exports.respond = respond;
