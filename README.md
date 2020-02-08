# MMO-server

MMO Server is a very basic javascript version of Alex Krantz's
"Massively Multiplayer Online game server" adapted from the Go language original.

The server can be launched locally with the command 'node index.js' or 'npm start' or 'heroku local'.  

The server serves both static http files from the public folder and
websockets using the express and express-ws node modules.

The public folder contains an example client that can be used to demonstrate
the websocket services.  When running the server locally, the client can
be accessed from the server with the url http://localhost:xxxx.

This repo has a git remote "heroku" linked to the heroku app 'advanced-animation' so
that it can be uploaded by credentialed users with the command 'git push heroku master'.

The server can be accessed remotely with the url 'https://advanced-animation.herokuapp.com'.
