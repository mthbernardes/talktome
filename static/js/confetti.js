const canvasEl = document.querySelector('#confetti');

const w = canvasEl.width = window.innerWidth;
const h = canvasEl.height = window.innerHeight * 2;

function confetti_loop() {
  requestAnimationFrame(confetti_loop);
	confetti_context.clearRect(0,0,w,h);
  
  confs.forEach((conf) => {
    conf.update();
    conf.draw();
  })
}

function Confetti () {
  //construct confetti
  const colours = ['#fde132', '#009bde', '#ff6b00'];
  
  this.x = Math.round(Math.random() * w);
  this.y = Math.round(Math.random() * h)-(h/2);
  this.rotation = Math.random()*360;

  const size = Math.random()*(w/60);
  this.size = size < 15 ? 15 : size;

  this.color = colours[Math.floor(colours.length * Math.random())];

  this.speed = this.size/7;
  
  this.opacity = Math.random();

  this.shiftDirection = Math.random() > 0.5 ? 1 : -1;
}

Confetti.prototype.border = function() {
  if (this.y >= h) {
    this.y = h;
  }
}

Confetti.prototype.update = function() {
  this.y += this.speed;
  
  if (this.y <= h) {
    this.x += this.shiftDirection/3;
    this.rotation += this.shiftDirection*this.speed/100;
  }

  if (this.y > h) this.border();
};

Confetti.prototype.draw = function() {
  confetti_context.beginPath();
  confetti_context.arc(this.x, this.y, this.size, this.rotation, this.rotation+(Math.PI/2));
  confetti_context.lineTo(this.x, this.y);
  confetti_context.closePath();
  confetti_context.globalAlpha = this.opacity;
  confetti_context.fillStyle = this.color;
  confetti_context.fill();
};

const confetti_context = canvasEl.getContext('2d');
const confNum = Math.floor(w / 4);
const confs = new Array(confNum).fill().map(_ => new Confetti());
