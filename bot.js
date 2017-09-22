var HTTPS = require('https');
var botID = process.env.BOT_ID;
var fs = require('fs');

var count;
var path = './count.txt';

console.log(botID);

fs.readFile(path, 'utf8', function(err, data) {
  if(err) {
    return console.log(err);
  }
  count = data;
  console.log(count);
});

function writeCount(count) {
  fs.writeFile(path, 'utf8', count, function(err) {
    if(err) return console.log(err);
    console.log(count + " > count");
  });
  fs.readFile(path, 'utf8', function(err, data) {
    if (err) {
      return console.log(err);
    }
    console.log(data);
  });
}

function respond() {
  var request = JSON.parse(this.req.chunks[0]),
      botRegex1 = /LMAO/ig,
      botRegex2 = /^\/trish lmao count$/igm,
      botRegex3 = /^\/help$/igm,
      trishUserID = 49924159;

  //console.log(request);

  if(request.text && botRegex1.test(request.text) && (request.sender_id == trishUserID)) {
    this.res.writeHead(200);
    count++;
    writeCount(count);
    this.res.end();
  }
  else if(request.text && botRegex2.test(request.text)) {
    this.res.writeHead(200);
    postMessage();
    this.res.end();
  }
  else if(request.text && botRegex3.test(request.text)) {
    this.res.writeHead(200);
    postHelpMessage();
    this.res.end();
  }
  else {
    console.log("don't care \"" + request.text + "\"");
    this.res.writeHead(200);
    this.res.end();
  }
}

function postMessage() {
  var botResponse, options, body, botReq;

  botResponse = "The Trish LMAO count is now at " + count;

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

function postHelpMessage() {
  var botResponse, options, body, botReq;

  botResponse = "This bot counts the number of times Trish says lmao. Send \"/trish lmao count\" to see the count";

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
