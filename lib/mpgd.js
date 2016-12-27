var ws = require("nodejs-websocket")

var next_player = 1;
var new_player = function() { return "P"+(next_player++); }

var game = [];

var new_postion = function()
{
	while (1)
	{
		var x = Math.floor(Math.random()*10);
		var y = Math.floor(Math.random()*10);
		var found = false;
		for (var p in game)
		{
			if (game[p].x==x && game[p].y==y)
			{
				found = true;
				break;
			}
		}
		if (!found)
			return { x:x, y:y };
	}
	//	Not reached
}

var game_count_players = function()
{
	var r = 0;
	for (var p in game)
		r++;
	return r;
}

var game_any_player = function()
{
	for (var p in game)
		return p;
	return undefined;
}

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
      		var p = new_postion();
      		player.x = p.x;
      		player.y = p.y;
      		player.state = game_count_players()===0?"ACTIVE":"IDLE";
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
        if (player.state==="ACTIVE")
        {
        	if (game_count_players()>0)
        		game[game_any_player()].state = "ACTIVE";
        }
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
