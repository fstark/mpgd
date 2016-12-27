var ws = require("nodejs-websocket")

var next_player = 1;
var new_player = function() { return "P"+(next_player++); }

var game = [];

var server = ws.createServer(function (conn)
{
	var player = new_player();
    conn.on("text", function (str)
    {
    	var msg = str.split( ' ' );

    	if (msg[0]=="HELLO")
  	 	{
      		console.log("-> HELLO")
      		game[player] = { x:0, y: 0, state:"IDLE" };
			sendStatus( conn, player );
		}
		else if (msg[0]=="PING")
		{
      		console.log("-> PING")
			sendStatus( conn, player );
		}
		else if (msg[0]=="PLAY")
		{
      		console.log("-> PLAY ???")
		}
    })
    conn.on("close", function (code, reason) {
        console.log("Connection closed")
    })
}).listen(8001)

var sendStatus = function( conn, player )
{
	var msg = {};
	msg.version = 0;
	msg.player = player;
	msg.games = {};
	for (var p in game)
	{
		msg.games[p] = {};
		msg.games[p].x = game[p].x;
		msg.games[p].y = game[p].y;
		msg.games[p].state = game[p].state;
	}
	conn.sendText( JSON.stringify(msg) );
}
