Server messages are always:

MESSAGE: {"version":0,"player":"P2","games":{"P1":{"x":0,"y":0,"state":"IDLE"},"P2":{"x":0,"y":0,"state":"IDLE"}}}

Clients messages are:

HELLO

-> Logs player in

PING

-> Asks for a message back from the server

PLAY NEWX, NEWY

-> Moves player to position NEWX, NEWY, if possible
	Will be ignored if player is not READY

