class Player extends MMOC{
  constructor(){
    super();
    this.init();//found in MMOC
    this.restart();//commences game

  }

  run(){
    this.checkEdges();
    this.update();
    if(this.won == true){
      console.log("has won ");
      ctx.fillStyle = 'rgba(225,215,0,.9)';
      ctx.beginPath();
      ctx.arc(this.loc.x,this.loc.y,this.rad,Math.PI*2,0,false);
      ctx.fill();
      ctx.font = '48px serif';
      ctx.textAlign = "center";
      ctx.fillText("YOU WON",canvas.width/2,canvas.height/2);
    }
    if(this.lost == true){
      console.log("has lost");
      ctx.fillStyle = 'rgba(139,0,0,.9)';
      ctx.beginPath();
      ctx.arc(this.loc.x,this.loc.y,this.rad,Math.PI*2,0,false);
      ctx.fill();
      ctx.font = '48px serif';
      ctx.textAlign = "center";
      ctx.fillText("YOU LOST",canvas.width/2,canvas.height/2);    }

  }
  checkEdges(){//terminates player when player hits edge
    if (this.loc.x >= canvas.width) {
      this.vel.multiply(0);
      this.isDead = true;
      this.setIsDead(this.isDead);
    }
    if (this.loc.x <= 0){
      this.vel.multiply(0);
      this.isDead = true;
      this.setIsDead(this.isDead);
    }
    if(this.loc.y >= canvas.height){
      this.vel.multiply(0);
      this.isDead = true;
      this.setIsDead(this.isDead);
    }
    if(this.loc.y <= 0){
      this.vel.multiply(0);
      this.isDead = true;
      this.setIsDead(this.isDead);
  }
}

  update(){

    this.setX(this.loc.x);
    this.setY(this.loc.y);
    // this.trail.push(this.loc.copy());//pushes copy of location vector to trail
    // console.log(this.trail.length);
    this.setOther("trail",this.trail);
    this.setX(this.loc.x);
    this.setY(this.loc.y);
    this.loc.add(this.vel);
    this.loc.x = parseFloat(this.loc.x.toFixed(2));
    this.loc.y = parseFloat(this.loc.y.toFixed(2));

    //this.renderTrail(this.trail,this.getColor());
    this.renderOthers();
    this.collisionDetection();
    this.timer++;
    if(this.timer === 2){
      this.timer = 0;
      this.trail.push(this.loc.copy());//pushes copy of location vector to trail
      if(this.trail.length > 200)
          this.trail.shift();     // remove first element of trail
      if(this.ws.readyState == 1 ) this.sendPlayerData();
    }
  }
  render(){//draws player
    ctx.fillStyle = 'rgba(250,250,250,.9)';
    ctx.beginPath();
    ctx.arc(this.loc.x,this.loc.y,this.rad,Math.PI*2,0,false);
    ctx.fill();
  }

  renderTrail(trail,color){//draws a players trail and takes in a trail and color as parameter
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 15;
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(trail[0].x,trail[0].y);
    //console.log(trail.x+","+trail[0].y);
    for(let i = 1; i<trail.length;i++){
      ctx.lineTo(trail[i].x,trail[i].y);
      }
    ctx.stroke();

    }

  renderOthers(){
    var players = this.getPlayers();
    if (players){
      var player;
      var keys = Object.keys(players);
      //console.log(keys);
      for(var i = 0;i< keys.length;i++){
        if(keys[i] === this.getId()){
          this.render();
        }

        player = players[keys[i]];
        this.renderTrail(player.other.trail,player.color);

        }
    }
  }

  restart(){
    console.log("restart");
    var vec = new JSVector(0,100);
    vec.rotate(Math.random()* (2* Math.PI));
    vec.x+= canvas.width/2;
    vec.y+= canvas.height/2;
    this.loc = vec;
    this.vel = new JSVector(.5,.5);
    this.vel.setMagnitude(2);
    this.vel.setDirection(Math.random()* (2 * Math.PI));
    this.acc = new JSVector(0,0);
    this.rad = 25;
    this.trail = [];
    this.setOther("trail",this.trail);
    this.isDead = false;
    this.timer = 0;
    this.won = false;
    this.lost = false;
  }

  collisionDetection(){
    var players = this.getPlayers();
    var keys = Object.keys(players);//player ids
    for(var i = 0;i<keys.length;i++){//amount of players
      var trail = players[keys[i]].other.trail;//player trail
      //debugger;
      var length = trail.length;
      if(keys[i] == this.getId()){
        if(length >= 40 ){ length -=40;
        }else{ length = 0;
        }
      }
      for(let t = 0;t<length;t++){
        var distanceSquared = Math.pow((trail[t].x-this.loc.x),2) + Math.pow((trail[t].y-this.loc.y),2);
        if(distanceSquared <= 100){
          this.isDead = true;
          // console.log(this.isDead);
          this.setIsDead(this.isDead);
          this.vel.multiply(0);
          //console.log(this.isDead);
          t = length;
        }
     }
    }
  }


}
