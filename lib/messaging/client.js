var messenger = require('messenger');

var client = messenger.createSpeaker(8000);

setInterval(function(){
  client.request('update', {hello: 'world'}, function(data) {
    console.log(data);
  });
}, 1000);
