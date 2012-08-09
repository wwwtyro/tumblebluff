
function vector(x, y, z) {
    
    this.x = typeof x !== 'undefined' ? x : 0;
    this.y = typeof y !== 'undefined' ? y : 0;
    this.z = typeof z !== 'undefined' ? z : 0;

}


vector.prototype.set = function(x, y, z) {
    this.x = typeof x !== 'undefined' ? x : this.x;
    this.y = typeof y !== 'undefined' ? y : this.y;
    this.z = typeof z !== 'undefined' ? z : this.z;
}

vector.prototype.clone = function() {
    return new vector(this.x, this.y, this.z);
}

vector.prototype.plus = function(v) {
    if (typeof v !== 'number') {
        return new vector(this.x + v.x, this.y + v.y, this.z + v.z);
    }
    return new vector(this.x + v, this.y + v, this.z + v);
}

vector.prototype.minus = function(v) {
    if (typeof v !== 'number') {
        return new vector(this.x - v.x, this.y - v.y, this.z - v.z);
    }
    return new vector(this.x - v, this.y - v, this.z - v);
}

vector.prototype.times = function(v) {
    return new vector(this.x * v, this.y * v, this.z * v);
}

vector.prototype.dot = function(v) {
    return this.x*v.x + this.y*v.y + this.z*v.z;
}

vector.prototype.length = function() {
    return Math.sqrt(this.dot(this));
}

vector.prototype.over = function(v) {
    if (v === 0) {
        return new vector(0, 0, 0);
    }
    return new vector(this.x/v, this.y/v, this.z/v);
}

vector.prototype.unit = function() {
    return this.over(this.length());
}

vector.prototype.THREE = function(v) {
    if (typeof v === 'undefined') {
        return new THREE.Vector3(this.x, this.y, this.z);
    }
    v.set(this.x, this.y, this.z);
}
    
vector.random2d = function() {
    v = new vector();
    v.x = Math.random() - 0.5;
    v.y = Math.random() - 0.5;
    v.z = 0;
    return v.unit();
}

vector.random3d = function() {
    v = new vector();
    v.x = Math.random() - 0.5;
    v.y = Math.random() - 0.5;
    v.z = Math.random() - 0.5;
    return v.unit();
}
