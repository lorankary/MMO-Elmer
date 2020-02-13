// Import main express library
const express = require('express');
const expressWs = require('express-ws');
const PORT = process.env.PORT || 8080;

// Create express app and websockets middleware
let websocketServer = expressWs(express());
let app = websocketServer.app;

// console.log(websocketServer.getWss());

// Data storage
let DATA = {};
var colorStorage = ["Blue","Red","Green", "Orange","Gold", "Aqua","BlueViolet","Brown", "CadetBlue","Chocolate","CornflowerBlue","Crimson","Cyan", "GreenYellow","LightGreen","Pink","LightSkyBlue"];
var colors = ["Blue","Red","Green", "Orange","Gold", "Aqua","BlueViolet","Brown", "CadetBlue","Chocolate","CornflowerBlue","Crimson","Cyan", "GreenYellow","LightGreen","Pink","LightSkyBlue"];
// Set static directory (put index.html and whatnot in here)
app.use(express.static('public'));
app.get("/restart",function(req, resp){
  for(ws of websocketServer.getWss().clients){
    if(ws.readyState === 1){
      ws.send(JSON.stringify({
        type:"restart",
      }));
    }
  }
  console.log("restart");
  resp.end();
});

// Websockets handler
app.ws('/ws', function(ws, req) {
    let playerID;

    console.log("new player");

    // restarting when player connects
    for(client of websocketServer.getWss().clients){
      if(client.readyState === 1){
        client.send(JSON.stringify({
          type:"restart",
        }));
      }
    }
    DATA = {};
  //  console.log(websocketServer.getWss().clients);


    // On message event
    ws.on('message', function(msg) {
      var idString ='"id":"';
      var num = msg.indexOf(idString)
      if (num>= 0){

        var numEnd = msg.indexOf('"',num + idString.length);
        //console.log(numEnd);
        var id = msg.substring(num+idString.length,numEnd);
        //console.log(id);
        this.playerID = id;
        //console.log(this.playerID);
        DATA[id] = msg;
      }
      });

    if(colors.length<1){//ensures colors never runs out of colors for players
      for(let i = 0;i< colorStorage;i++){
        colors.push(colorStorage[i]);
      }
    }
    var r = (Math.floor(Math.random() * colors.length));//picks random number using length of colors array
    ws.send(JSON.stringify({
      type: "color",
      color:colors[r]//uses random num r and assings a random color from colors
    }));
    colors.splice(r,1);//takes out random color from colors array

    // On close event
    ws.on('close', function() {
      console.log("end "+this.playerID);
      delete DATA[this.playerID];
      // for(var player in DATA){
      //   //console.log(player);
      //   if(DATA[player].ws == this){
      //     //console.log(DATA);
      //     //console.log(DATA[player]);
      //     delete DATA[player];
      //     //console.log(DATA);
      //   }
      // }

    });
});
//pushes information to clients at given interval
 setInterval(() => {
   for(ws of websocketServer.getWss().clients){
     if(ws.readyState === 1){
       ws.send(JSON.stringify({
         type:"data",
         data:DATA
       }));
     }
   }
   var lives = []
   var areDead =0;
   var areAlive=0;
   var players = Object.keys(DATA);
   //console.log(players.length);
   for(let i = 0;i < players.length;i++){
     var deadString = '"dead":';
     var num = DATA[players[i]].indexOf(deadString);
     //console.log(num);
     if(num>0){
       var endOfDead = DATA[players[i]].indexOf(',',num + deadString.length);
       //console.log(endOfDead);
       var statment = DATA[players[i]].substring(num+deadString.length,endOfDead);
       //console.log(statment)
       if(statment ==="true"){
         lives[i] = true;
         areDead++;
       }else{
         lives[i] = false;
         areAlive++;
       }
      }

      // for(let k =0;k<lives.length;k++){
      //   console.log(lives[k]);
      // }
   }
   if(lives.length>1){
     if (areAlive == 1){//game is over
       for(let k = 0;k<lives.length;k++){
         if(lives[k] == false){//player that is alive
          for(ws of websocketServer.getWss().clients){
            if(ws.playerID === players[k]){//is this the websocket for this player
              if(ws.readyState == 1){//checks connection
                //console.log(ws.playerID + "has won");
                ws.send(JSON.stringify({//player message
                  type:"won"
                }));
              }
            }else{
              if(ws.readyState == 1){
              //  console.log(ws.playerID+ "has lost");
                ws.send(JSON.stringify({
                  type:"lost"
                }));

              }

            }

          }

        }

      }
    }

 }
},33);

// let host = process.env.MMOS_HOST || "localhost";
// let port = parseInt(process.env.MMOS_PORT) || 8080;

console.log("process.env.HOST " + process.env.HOST);
console.log("process.env.PORT " + process.env.PORT);

app.listen(PORT, function() {
	console.log(`[+] Listening on ${PORT}`);
});
