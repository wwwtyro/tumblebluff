

function View(world) {
    
    // Parameters.
    this.landSize = 6;
    this.landResolution = 32;

    // Initialization.
    this.world = world;
    this.scene = new THREE.Scene();
    
    // Load the textures.
    this.landTexture    = THREE.ImageUtils.loadTexture('sand2.png');

    // Camera.
    var aspect = window.innerWidth/window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(45, aspect, 1, 1000);
    this.camera.position.set(0, 0, 5);
    this.scene.add(this.camera);
    
    // Light.
    this.light = new THREE.DirectionalLight(0xffffff, 1.0);
    this.light.position.set(-1, -1, 2);
    this.scene.add(this.light);

    // Weed.
    var g = weedGeometry(world.weed.radius, 128);
    var m = new THREE.MeshLambertMaterial({color:0xc9be62});
    this.weedMesh = new THREE.Mesh(g, m);
    this.weedMesh.doubleSided = true;
    this.weedMesh.position.set(0, 0, 0);
    this.scene.add(this.weedMesh);

    // Tumbles.
    this.tumbleMeshes = [];
    for(var i = 0; i < world.tumbles.length; i++) {
        var g = weedGeometry(world.tumbles[i].radius, 128);
        var m = new THREE.MeshLambertMaterial({color:0xeebe62});
        var mesh = new THREE.Mesh(g, m);
        mesh.doubleSided = true;
        var p = world.tumbles[i].position;
        mesh.position.set(p.x, p.y, 0);
        this.tumbleMeshes.push(mesh);
        this.scene.add(mesh);
    }

    // Land.
    this.landGeometry = new THREE.PlaneGeometry(this.landSize, this.landSize, this.landResolution, this.landResolution);
    this.landGeometry.dynamic = true;
    this.landTexture.wrapS = this.landTexture.wrapT = THREE.RepeatWrapping;
    this.landTexture.repeat.set(2, 2);
    var m = new THREE.MeshLambertMaterial({map:this.landTexture, wireframe:false});
    this.landMesh = new THREE.Mesh(this.landGeometry, m);
    this.landMesh.rotation.x = Math.PI/2;
    this.landMesh.position.set(this.camera.position.x, this.camera.position.y, 0);
    this.scene.add(this.landMesh);
    
    // Renderer.
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);
    

    this.rotateRoller = function(step, mesh, radius) {
        var tempMat = new THREE.Matrix4();
        tempMat.makeRotationAxis(new THREE.Vector3(0,1,0), step.x/radius);
        tempMat.multiplySelf(mesh.matrix);
        var tempMat2 = new THREE.Matrix4();
        tempMat2.makeRotationAxis(new THREE.Vector3(1,0,0), -step.y/radius);
        tempMat2.multiplySelf(tempMat);
        mesh.rotation.getRotationFromMatrix(tempMat2, mesh.scale);
        
    }
    

    this.render = function() {

        // Update weed mesh.
        this.weedMesh.position.x = world.weed.position.x;
        this.weedMesh.position.y = world.weed.position.y;
        this.weedMesh.position.z = world.landHeight(this.weedMesh.position.x, -this.weedMesh.position.y) + world.weed.radius;
        this.rotateRoller(world.weed.lastStep, this.weedMesh, world.weed.radius);        
        
        // Update the tumble meshes.
        for(var i = 0; i < world.tumbles.length; i++) {
            wti = world.tumbles[i];
            tmi = this.tumbleMeshes[i];
            var p = wti.position.clone();
            p.z = world.landHeight(p.x, -p.y) + wti.radius;
            tmi.position.set(p.x, p.y, p.z);
            this.rotateRoller(wti.lastStep, tmi, wti.radius);        
        }
        
        // Update camera position.
        this.camera.position.x += 0.1*(this.weedMesh.position.x - this.camera.position.x);
        this.camera.position.y += 0.1*(this.weedMesh.position.y - this.camera.position.y);
        this.camera.position.z += 0.1*((this.weedMesh.position.z + world.weed.radius + 3) - this.camera.position.z);
        
        // Update land mesh.
        this.landMesh.position.set(this.camera.position.x, this.camera.position.y, 0);
        this.landTexture.offset.x = this.landMesh.position.x/(this.landSize/this.landTexture.repeat.x);
        this.landTexture.offset.y = -this.landMesh.position.y/(this.landSize/this.landTexture.repeat.y);
        for(var i = 0; i < this.landGeometry.vertices.length; i++) {
            var x = this.landGeometry.vertices[i].x + this.landMesh.position.x;
            var y = this.landGeometry.vertices[i].z - this.landMesh.position.y;
            this.landMesh.geometry.vertices[i].y = world.landHeight(x, y);
        }
        this.landGeometry.computeFaceNormals();
        this.landGeometry.computeVertexNormals();
        this.landMesh.geometry.verticesNeedUpdate = true;
        this.landMesh.geometry.normalsNeedUpdate = true;
        
        // Render.
        this.renderer.render(this.scene, this.camera);
    
    }

    
}

function weedGeometry(radius, count) {
    var dr = radius * 0.25;
    var g = new THREE.Geometry();
    for(var i = 0; i < count; i++) {
        var x = Math.random() - 0.5;
        var y = Math.random() - 0.5;
        var z = Math.random() - 0.5;
        var mag = Math.sqrt(x*x+y*y+z*z);
        var rad = Math.random() * radius;
        x = rad * x/mag;
        y = rad * y/mag;
        z = rad * z/mag;
        for(var j = 0; j < 3; j++) {
            var dx = x + (Math.random() - 0.5) * dr*2;
            var dy = y + (Math.random() - 0.5) * dr;
            var dz = z + (Math.random() - 0.5) * dr;
            g.vertices.push(new THREE.Vector3(dx, dy, dz));
        }
        g.faces.push(new THREE.Face3(i*3+0, i*3+1, i*3+2));
    }
    g.computeFaceNormals();
    return g;
}
    
    

