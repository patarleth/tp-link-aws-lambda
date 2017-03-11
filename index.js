'use strict';

var https = require('https');
var rsvp = require('rsvp');

var makeTPLinkPOSTPromise = function( token, deviceId, systemReqString ) {
    var postPromise = new rsvp.Promise(function(resolve, reject) {
        var post_data = JSON.stringify({
          'method' : 'passthrough',
          'params': {
          'deviceId': deviceId,
          'requestData': systemReqString
          }
          });

          // An object of options to indicate where to post to
          var post_options = {
              host: 'wap.tplinkcloud.com',
              path: '/?token=' + token,
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'Content-Length': Buffer.byteLength(post_data)
              }
          };
      // Set up the request
      var post_req = https.request(post_options, function(res) {
          res.setEncoding('utf8');
          res.on('data', function (chunk) {
            resolve(chunk);
          }).on('error', (e) => {
            reject(e);
          });
      });

      // post the data
      post_req.write(post_data);
      post_req.end();
    });

    return postPromise;
}

exports.handler = (event, context, callback) => {
    var tokenStr = process.env.TP_TOKEN;
    var deviceIdStr = process.env.TP_DEVICE_ID;

    console.log('Received event:', event);

    var statusRequestData = '{"system":{"get_sysinfo":null},"emeter":{"get_realtime":null}}'
    makeTPLinkPOSTPromise( tokenStr, deviceIdStr, statusRequestData ).then(function(chunk) {
        var myRegexp = /.*relay_state..:([0-9]+).*/g;
        var match = myRegexp.exec(chunk);
        var relayState=parseInt(match[1]);
        if( relayState == 0 ) {
            console.log('turning light on');
            var onRequestData = '{"system":{"set_relay_state":{"state": 1}}}';
            return makeTPLinkPOSTPromise( tokenStr, deviceIdStr, onRequestData);
        } else {
            console.log('turning light off');
            var onRequestData = '{"system":{"set_relay_state":{"state": 0}}}';
            return makeTPLinkPOSTPromise( tokenStr, deviceIdStr, onRequestData);
        }
    }).then(function(setStatusResponse) {
        console.log(setStatusResponse);
    }).catch(function(err) {
        console.log(err);
    });
};