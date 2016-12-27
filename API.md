Server messages are always:

<VERSION> <CLIENTID> <PLAYER_COUNT>
	<PLAYERID> <STATE> <POSX> <POSY>
	...

VERSION is '0'
CLIENTID is a string representing the connected player
PLAYER_COUNT is the number of players on the server
STATE in IDLE, READY
POSX is the position X of that player
POSY is the position Y of that player


Clients messages are:

HELLO

-> Logs player in

PING

-> Asks for a message back from the server

PLAY NEWX, NEWY

-> Moves player to position NEWX, NEWY, if possible
	Will be ignored if player is not READY

