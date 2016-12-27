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

var game_next_player = function( player_id )
{
	var found = false;
	for (var p in game)
		if (p==player_id)
			found = true;
		else
			if (found)
				return p;
	if (found)
		return game_any_player();
	return undefined;
}

var game_position_ok = function( x, y )
{
		//	In game
	if (x<0 || x>=10 || y<0 || y>=10)
		return false;
		//	Free
	for (var p in game)
		if (game[p].x==x && game[p].y==y)
			return false;
	return true;
}

var distance = function( x0, y0, x1, y1 )
{
	return Math.abs(x0-x1)+Math.abs(y0-y1);
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
      		player.sendStatus = function()
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
			player.sendStatus();
		}
		else if (msg[0]=="PLAY")
		{
			var x = msg[1]-0;
			var y = msg[2]-0;
     		console.log("-> PLAY "+x+" "+y );
      		if (player.state!="ACTIVE")
      		{
	      		console.log("-> PLAY : NOT ACTIVE");
      			player.sendStatus();
      			return ;
      		}

      		//	Check pos is near
      		if (distance(player.x,player.y,x,y)!=1)
      		{
	      		console.log("-> PLAY : TOO FAR");
      			player.sendStatus();
      			return ;
      		}

      		//	Check pos is ok
      		if (!game_position_ok(x,y))
      		{
	      		console.log("-> PLAY : BAD POSITION");
      			player.sendStatus();
      			return ;
      		}

      		player.x = x;
      		player.y = y;
      		var next_id = game_next_player( player_id );
      		player.state = "IDLE";
      		game[next_id].state = "ACTIVE";
			sendStatusAll();
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
