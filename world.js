

function WorldObject() {
    this.position      = new vector();
    this.velocity      = new vector();
    this.externalForce = new vector();
    this.lastStep      = new vector();
}


function World() {


    // Initialization.
    this.weed    = new WorldObject();
    this.weed.radius = 0.125;
    this.weed.mass = 1;//50 * (4/3) * (Math.PI*this.weed.radius*this.weed.radius*this.weed.radius);
    this.perlin  = new Perlin('seed');
    this.windStrength = 0.1;
    this.wind = new vector();
    this.windTarget = vector.random2d().times(this.windStrength);
    this.tumbles = [];
    for(var i = 0; i < 10; i++) {
        this.tumbles.push(new WorldObject());
        this.tumbles[i].position = vector.random2d().times(2);
        this.tumbles[i].externalForce = vector.random2d().times(Math.random()*0.5 + 0.5);
        this.tumbles[i].radius = i/(10*4) + 0.05;
        this.tumbles[i].mass = 1;//50 * (4/3) * (Math.PI*this.tumbles[i].radius*this.tumbles[i].radius*this.tumbles[i].radius);
    }

    // Land functions.
    this.landHeight = function(x, y) {
        var o1 = 2 * this.perlin.noise(x/2, y/2, 0);
        var o2 = 0.25 * this.perlin.noise(x, y, 0);
        return o1 + o2;
    }
    
    

    this.landForce = function(x, y) {
        var dr = 0.001;
        var e0 = this.landHeight(x, y);
        var edx = this.landHeight(x+dr, y);
        var edy = this.landHeight(x, y+dr);
        return new vector(-1*(edx-e0)/dr, 1*(edy-e0)/dr);
    }


    // World time step.
    this.step = function(dt) {
        // Update the wind.
        if(Math.random() < 0.01) {
            this.windTarget = vector.random2d().times(this.windStrength);
        }
        this.wind = this.wind.plus(this.windTarget.minus(this.wind).times(0.01));

        var f = this.weed.externalForce.clone();
        f = f.plus(this.landForce(this.weed.position.x, -this.weed.position.y));
        f = f.plus(this.weed.velocity.times(-0.75));
        f = f.plus(this.wind);
        f = f.over(this.weed.mass);
        this.weed.velocity = this.weed.velocity.plus(f.times(dt));
        this.weed.lastStep = this.weed.velocity.times(dt);
        this.weed.position = this.weed.position.plus(this.weed.lastStep);
        
        for(var i = 0; i < this.tumbles.length; i++) {
            var ti = this.tumbles[i];
            var f = ti.externalForce.clone();
            f = f.plus(this.landForce(ti.position.x, -ti.position.y));
            f = f.plus(ti.velocity.times(-0.75));
            f = f.plus(this.wind);
            f = f.over(ti.mass);
            ti.velocity = ti.velocity.plus(f.times(dt));
            ti.lastStep = ti.velocity.times(dt);
            ti.position = ti.position.plus(ti.lastStep);
            if(ti.position.minus(this.weed.position).length() > 6) {
                ti.position = this.weed.position.plus(this.weed.position.minus(ti.position).times(0.9));
            }
        }
        
        
    }


}


