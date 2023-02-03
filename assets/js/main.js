let bloom = false;
let smoothen = 1;
let trailLength = 20;
let particleCount = 1000;
let trails = true;
let tracers = true;

let canvas = document.createElement('canvas');
let ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.onresize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

let particles = [];

let render = () => {
    requestAnimationFrame(render);

    ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(0, 0, 0)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if(bloom)
        ctx.shadowBlur = 25;
    else
        ctx.shadowBlur = 0;

    particles.forEach(p => p.update());
}

render();

window.onload = () => {
    document.body.appendChild(canvas);
}

class Particle{
    constructor(){
        this.x = 0;
        this.y = 0;
        this.x1 = 0;
        this.y1 = 0;
        this.angle = Math.random() * 360;
        this.speed = 1 + Math.random() * 2;
        this.size = 2;
        this.radius = (Math.random() * (canvas.width / 2)) + 10;
        this.trail = [];
        this.updateFrame = 0;
    }
    update(){
        this.angle += this.speed;
        this.calculatePos();

        ctx.fillStyle = 'hsl(' + this.angle + ', 100%, 50%)';
        ctx.shadowColor = 'hsl(' + this.angle + ', 100%, 50%)';

        if(bloom)
            ctx.shadowBlur = 25;
        else
            ctx.shadowBlur = 0;

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI, false);
        ctx.fill();
        ctx.closePath();

        ctx.shadowBlur = 0;

        // Tracers, look a bit meh, not worth the performance
        if(tracers){
            let grd = ctx.createLinearGradient(canvas.width / 2, canvas.height / 2, this.x, this.y);
            grd.addColorStop(0, 'hsla(' + this.angle + ', 100%, 100%, 25%)');
            grd.addColorStop(1, 'hsla(' + this.angle + ', 100%, 50%, 25%)');

            ctx.strokeStyle = grd;

            ctx.beginPath();
            ctx.moveTo(canvas.width / 2, canvas.height / 2);
            ctx.lineTo(this.x, this.y);
            ctx.stroke();
            ctx.closePath();
        }

        // Look amazing without tracers
        if(trails){
            ctx.strokeStyle = 'hsl(' + this.angle + ', 100%, 50%)';
            ctx.shadowColor = 'hsl(' + this.angle + ', 100%, 50%)';

            ctx.beginPath();
            ctx.moveTo(this.x, this.y);

            this.trail.forEach((pos, i) => {
                ctx.lineTo(pos[0], pos[1])
            });

            ctx.stroke();
            ctx.closePath();

            if(this.updateFrame > smoothen){
                this.trail.splice(0, 0, [ this.x, this.y ]);
                this.updateFrame = 0;
            }

            if(this.trail.length > trailLength / smoothen)
                this.trail.pop();
        }

        this.updateFrame++;
    }
    calculatePos(){
        let xOffset = Math.cos(this.angle * ( Math.PI / 180  )) * this.radius;
        let yOffset = Math.sin(this.angle * ( Math.PI / 180  )) * this.radius;

        this.x = (canvas.width / 2) + xOffset;
        this.y = (canvas.height / 2) + yOffset;
    }
}

for (let index = 0; index < particleCount; index++) {
    particles.push(new Particle());
}