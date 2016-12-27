var ws = require("nodejs-websocket")

var next_player = 1;
var new_player = function() { return "P"+(next_player++); }

var game = [];

var server = ws.createServer(function (conn)
{
	var player_id = new_player();
	var player = {};

    conn.on("text", function (str)
    {
    	var msg = str.split( ' ' );

    	if (msg[0]=="HELLO")
  	 	{
      		console.log("-> HELLO")
      		player.x = 0;
      		player.y = 0;
      		player.state = "IDLE";
      		player.sendStatus = function( msg )
      		{
				var msg = {};
				msg.version = 0;
				msg.player = player_id;
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
      		game[player_id] = player;

			sendStatusAll();
		}
		else if (msg[0]=="PING")
		{
      		console.log("-> PING")
			player.sendStatus( conn, player_id );
		}
		else if (msg[0]=="PLAY")
		{
      		console.log("-> PLAY ???")
		}
    })
    conn.on("close", function (code, reason)
    {
        console.log("Connection closed")
    	delete( game[player_id] );
		sendStatusAll();
    })
}).listen(8001)

var sendStatusAll = function()
{
	for (var p in game)
	{
		game[p].sendStatus();
	}
}
