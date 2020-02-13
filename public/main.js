'use strict'
window.onload = init;




var player;
var canvas;
var ctx;

var frameCount = 0;





function init(){
  document.addEventListener('keydown',keyhandler);
  canvas = document.getElementById('cnv');
  canvas.style.backgroundColor = 'rgba(0,0,0, .9)';
  ctx = canvas.getContext('2d');

  player = new Player();// player with parameter of ID
 //multiplayer.init();
 //console.log(multiplayer);
 setInterval(animate,17);
 setInterval(()=>{
   // console.log(frameCount);
   frameCount=0;

 },1000);
}


function animate(){
  ctx.clearRect(0,0,canvas.width, canvas.height);
  player.run();
  frameCount++;
  //requestAnimationFrame(animate);
}



function keyhandler(e){
  //console.log(e.key);
     if(e.key ==="a" || e.key === "ArrowLeft"){
       player.vel.rotate(-.09);

     }
     if(e.key ==="d" || e.key === "ArrowRight" ){
       player.vel.rotate(.09);
     }
}
