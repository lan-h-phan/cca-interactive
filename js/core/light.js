/** @type (HTMLCanvasElement) */
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let lightsArray;

let gameFrame = 0;

// get mouse position
let mouse = {
    x:null,
    y:null,
    radius: (canvas.height/80) * (canvas.width/80),
}

window.addEventListener('mousemove',
    function(event){
        mouse.x = event.x;
        mouse.y = event.y;
    }
);


class Light {
    constructor(directionX, directionY) {
        this.image = new Image();
        this.image.src = 'sprite/grey.png';
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.directionX = directionX;
        this.directionY = directionY;
        this.speed = Math.random() * 4 - 2;
        this.spriteWidth = 153;
        this.spriteHeight = 153;
        this.width = this.spriteWidth/2;
        this.height = this.spriteHeight/2;
        this.frame = 0;
        this.blinkSpeed = Math.floor(Math.random()*50+1);
    }
    // draw peep
    draw(){
        ctx.drawImage(this.image, this.frame*this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
    }
    // check peep position, check mouse position, move
    update() {
        // animate sprites
        if (gameFrame % this.blinkSpeed === 0) {
            this.frame > 5 ? this.frame = 0: this.frame++;
        }
        
        //check if particle is still within canvas
        if (this.x > canvas.width || this.x <0) {
            this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y <0) {
            this.directionY = -this.directionY;
        }
        
        // check collision detection - mouse poisition/ particle position
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx*dx + dy*dy);
        if (distance < mouse.radius+50){
            if (mouse.x < this.x && this.x < canvas.width - 30) {
                this.x += 5;
            }
            if (mouse.x > this.x && this.x > 30) {
                this.x -= 5;
            }
            if (mouse.y < this.y && this.y < canvas.height - 30){
                this.y +=5;
            }
            if (mouse.y > this.y && this.y > 30) {
                this.y -= 5;
            }
        }
    // move light bulb
    this.x += this.directionX;
    this.y += this.directionY;  
    // draw light bulb
    this.draw(); 
    }
}

// create light array
function init(){
    lightsArray = [];
    let numberofLights = (canvas.height * canvas.width)/10000;
    for (let i = 0; i < numberofLights*1.5; i++) {
        let directionX = (Math.random()*3) - 2.5;
        let directionY = (Math.random()*3) - 2.5;
        
        lightsArray.push(new Light(directionX, directionY));
    }
}

// check if particles are close enough to draw line between them
function connect(){
    let opacityValue = 1;
    for(let a = 0; a < lightsArray.length; a++){
        for (let b = a; b <lightsArray.length; b++) {
            let distance = ((lightsArray[a].x - lightsArray[b].x)
            * (lightsArray[a].x - lightsArray[b].x))
            + ((lightsArray[a].y - lightsArray[b].y)
            * (lightsArray[a].y - lightsArray[b].y));
            if (distance < (canvas.width/7)*(canvas.height/7)) {
                opacityValue = 1 - (distance/20000);
                ctx.strokeStyle = 'rgba(255, 191, 0,' + opacityValue +')';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(lightsArray[a].x, lightsArray[a].y);
                ctx.lineTo(lightsArray[b].x, lightsArray[b].y);
                ctx.stroke();
            }
        }
    }
}


//animation loop
function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, innerWidth, innerHeight);

    for (let i = 0; i < lightsArray.length; i ++){
        lightsArray[i].update()
    }
    //lightsArray.forEach(light => {
      //  light.update();
        //light.draw();
    gameFrame++;
    connect();
}

// resize even
window.addEventListener('resize',
    function(){
        canvas.width = this.innerWidth;
        canvas.height = this.innerHeight;
        mouse.radius = ((canvas.height/80) * (canvas.width/80));
        init();
    }
);

//mouse out event
window.addEventListener('mouseout',
    function(){
        mouse.x = undefined;
        mouse.x = undefined;
    }
);

init();
animate();