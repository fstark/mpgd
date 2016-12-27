var ws = require("nodejs-websocket")
 
var server = ws.createServer(function (conn)
{
	sendStatus( conn, "P1" );
    conn.on("text", function (str)
    {
        console.log("Received "+str)
        conn.sendText(str.toUpperCase()+"!!!")
    })
    conn.on("close", function (code, reason) {
        console.log("Connection closed")
    })
}).listen(8001)

var sendStatus = function( conn, player )
{
	var msg = "0 "+player+" "+2+" P1 IDLE 5 5 P2 ACTIVE 3 8"
	conn.sendText( msg );
}
