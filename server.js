//http://ezelia.com/2014/tutorial-creating-basic-multiplayer-game-phaser-eureca-io

var words = require("./words.js");
var express = require('express')
  , app = express(app)
  , server = require('http').createServer(app);
 
app.get('/words/', function(req, res){
	words.generateSentence(req.query.s)
	.then(
		function(result){
			res.send(result);
		}
	);
});
 
// serve static files from the current directory
app.use(express.static("static"));


server.listen(8002);
