//http://ezelia.com/2014/tutorial-creating-basic-multiplayer-game-phaser-eureca-io

var express = require('express')
  , app = express(app)
  , server = require('http').createServer(app);
 
 
// serve static files from the current directory
app.use(express.static("static"));
 
 
server.listen(8000);