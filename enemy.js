class Enemy extends Player{
  constructor() {
    Super(id);
    this.id = id;
    this.loc = new JSVector(canvas.width/2,canvas.hegiht/2);
    this.vel = new JSVector(.5,.5);
    this.vel.setMagnitude(2);
    this.vel.setDirection(Math.random()* (2 * Math.PI));
    this.acc = new JSVector(0,0);
    this.rad = 30;
    this.maxSpeed =2;
    this.maxForce = .1;
    this.trail = [];
  }
  Steer(target){
    this.steer = JSVector.subGetNew(desired,this.vel);
    this.steer.limit(this.maxForce);
    return this.steer;

  }
  checkEdges(){
    if (this.loc.x >= canvas.width-30 || this.loc.x <= 30) {
      var desired = new JSVector(this.maxSpeed,this.vel.y);
      this.acc.add(Steer(desired));
    };
    if(this.loc.y >= canvas.height-30 || this.loc.y <= 30){
      var desired = new JSVector(this.maxSpeed,this.vel.y);
      this.acc.add(Steer(desired));
    }
  }
}
