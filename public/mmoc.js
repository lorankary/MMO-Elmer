let MMOC = (function() {
    const reqd = (name) => { throw new Error("Expected argument '" + name + "'") };

    let _id = "";
    let _x = 0;
    let _y = 0;
    let _z = 0;
    let _orientation = 0;
    let _other = {};
    let _data = {};
    let _connected = false;
    let _color = "white";
    let _isDead = false;

    class MMOC {
        init(id_len=8, wsurl) {
            // if no websocket url was supplied, use the same url as the index
            // file but with the ws protocol
            if(!wsurl){
                wsurl="//" + document.domain + ":" + location.port + "/ws";
                if (location.protocol === "https:") wsurl = "wss:" + wsurl;
                else wsurl = "ws:" + wsurl;
            }
            this.ws = new WebSocket(wsurl);

            this.ws.onopen = function (event) {
                let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

                for (let i = 0; i < id_len; i++) {
                    _id += possible.charAt(Math.floor(Math.random() * possible.length));
                }
                _connected = true;
                // setInterval(() => {
                //     this.send(JSON.stringify({
                //         type: 3
                //     }));
                // }, 15);
            };

            this.ws.onmessage =  (event) => {
                var message = JSON.parse(event.data);
                if(message.type == "data"){
                    var keys = Object.keys(message.data);
                  for(let i = 0;i< keys.length;i++){
                    message.data[keys[i]]= JSON.parse(message.data[keys[i]])
                  }
                  _data = message.data;
                }else if(message.type == "color"){
                  _color = message.color;
                  console.log(_color);
                }else if (message.type === "restart"){
                    console.log("restart message");
                  this.restart();

                }else if(message.type ==="won"){
                    console.log("won message");
                  this.vel.multiply(0);
                  this.won = true;
                }else if(message.type ==="lost"){
                  console.log("lost message");
                  this.vel.multiply(0);
                  this.lost = true;
                }

            };


        }

        sendPlayerData() {
          var message = JSON.stringify({
              type: 1,
              id: _id,
              color:_color,
              other: _other,
              dead:_isDead,
              coordinates: {
                  x: _x,
                  y: _y,
                  z: _z
              },
              orientation: _orientation
          })
            this.ws.send(message);
        }

        sendObjectData(object) {
            this.ws.send(JSON.stringify({
                type: 2,
                id: object.id,
                other: object.other,
                coordinates: {
                    x: object.x,
                    y: object.y,
                    z: object.z
                }
            }));
        }

        removeObject(object) {
            this.ws.send(JSON.stringify({
                type: 4,
                id: object.id
            }));
        }

        getPlayers() {
            return _data;
        }

        getGlobals() {
            return _data["Globals"];
        }

        getObjects() {
            return _data["Objects"];
        }
        getId(){
          return _id;
        }
        getOther(key){
           return _other[key];
      }
      getColor(){
        return _color;
      }
      getIsDead(){
        return _isDead;
      }



        changeX(by=reqd("by")) {
            _x += by;
        }

        changeY(by=reqd("by")) {
            _y += by;
        }

        changeZ(by=reqd("by")) {
            _z += by;
        }

        changeOrientation(by=reqd("by")) {
            _orientation += by;
        }

        setX(x){
          _x = x;
        }
        setY(y){
          _y = y;
        }
        setIsDead(dead){
          //console.log(this.isDead);
          _isDead = dead;
        }
        setOther(key=reqd("key"), value=reqd("value")) {
            _other[key] = value;
        }

        isconnected() {
            return new Promise(function(resolve, reject) {
                if (_connected) {
                    resolve();
                } else {
                    reject();
                }
            });
        }
    }

    return MMOC;
})();

class MovingObject {
    constructor(mesh, p, r) {
        this.id = (function () {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x1000).toString(16).substring(1);
            }
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
        })();
        this.mesh = mesh;

        this.x = 0;
        this.y = 0;
        this.z = 0;

        this.other = {};

        this.p = p;
        this.r = r;
    }

    render() {
        this.p();
        this.r();
    }

    setOther(key, value) {
        this.other[key] = value;
    }

    getOther(key) {
        return this.other[key];
    }
}
