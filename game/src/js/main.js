let Vector = {
    _x: 1,
    _y: 0,

    create: function (x, y) {
        let obj = Object.create(this);
        obj.setX(x);
        obj.setY(y);
        return obj;
    },

    setX: function (val) {
        this._x = val;
    },

    setY: function (val) {
        this._y = val;
    },

    getX: function () {
        return this._x;
    },

    getY: function () {
        return this._y;
    },

    getLength: function () {
        return Math.sqrt(this._x * this._x + this._y * this._y);
    },

    setAngel: function (angel) {
        let length = this.getLength();
        this._x = Math.cos(angel) * length;
        this._y = Math.sin(angel) * length;
    },

    getAngle: function () {
        return Math.atan2(this._y, this._x);
    },

    setLength: function (length) {
        let angel = this.getAngle();
        this._x = Math.cos(angel) * length;
        this._y = Math.sin(angel) * length;
    },

    add: function (v2) {
        return Vector.create(this._x + v2.getX(), this._y + v2.getY())
    },

    subtract: function (v2) {
        return Vector.create(this._x + v2.getX(), this._y + v2.getY())
    },

    scale: function (val) {
        return Vector.create(this._x + val, this._y + val)
    },
};

let Particle = {
  position: null,
  velocity: null,
  gravity: null,

  create: function (x, y, speed, direction, grav) {
      let obj = Object.create(this);
      obj.position = Vector.create(x, y);
      obj.velocity = Vector.create(0, 0);
      obj.velocity.setLength(speed);
      obj.velocity.setAngel(direction);
      obj.gravity = Vector.create(0, grav || 0);

      return obj;
  },

  accelerate: function (vector) {
      this.velocity = this.velocity.add(vector);
  },

  update: function () {
      this.velocity = this.velocity.add(this.gravity);
      this.position = this.position.add(this.velocity);
  }
};

let ball = document.getElementById('ball');
let offsetY;
let ballRadius;

let basket = document.getElementById('basket');
let basketWidth;
let ratio;
let scale;
let w;
let h;

let p;
let start;
let force;
let timestamp = null;
let lastMouse;
let lastMouseX;
let lastMouseY;
let hasThrow = false;
let highEnough = false;
let lastY;
let rot;

let shots = 0;
let hits = 0;
let score = 0;
let accuracy = 0;

TweenMax.to('.stage', 1, {autoAlpha:1, delay:1});

function getMouse(e) {
    return {
        x:e.clientX || e.targetTouches[0].clientX,
        y:e.clientY || e.targetTouches[0].clientY
    }
}

function grabBall(e) {

    e.preventDefault();

    p = Particle.create(0, offsetY, 0, 0, 0);
    force = Vector.create(0,0);
    start = Vector.create(getMouse(e).x, getMouse(e).y-offsetY);

    document.addEventListener("mousemove", moveBall);
    document.addEventListener("touchmove", moveBall);
}

function moveBall(e) {
    e.preventDefault();

    getSpeed(e);

    TweenMax.set(ball, {x:p.position.getX(), y:p.position.getY()});
}

function getSpeed(e) {
    e.preventDefault();

    if (timestamp === null) {
        timestamp = Date.now();
        lastMouse = getMouse(e);
        return
    }

    let now = Date.now();
    let currMouse = getMouse(e);
    let dx = currMouse.x - lastMouse.x;
    let dy = currMouse.y - lastMouse.y;

    dy *= 2;
    dx /= 2;

    timestamp = now;
    lastMouse = currMouse;

    force = Vector.create(dx, dy);
    p.position.setX(getMouse(e).x - start.getX());
    p.position.setY(getMouse(e).y - start.getY());
}

function addEvents() {
    ball.addEventListener('mousedown', grabBall);
    ball.addEventListener('touchstart', grabBall);
    ball.addEventListener('mouseup', releaseBall);
    ball.addEventListener('touchend', releaseBall);
}

function removeEvents() {
    ball.removeEventListener('mousedown', grabBall);
    ball.removeEventListener('touchstart', grabBall);
    ball.removeEventListener('mouseup', releaseBall);
    ball.removeEventListener('touchend', releaseBall);
}

function releaseBall() {
    ball.removeEventListener('mousedown', grabBall);
    ball.removeEventListener('touchstart', grabBall);

    document.removeEventListener('mousemove', moveBall);
    document.removeEventListener('touchmove', moveBall);

    timestamp = null;
    lastMouseX = null;
    lastMouseY = null;

    hasThrow = true;

    shots += 1;

    scale.play(0);

    if(force.getLength() > 30) force.setLength(30);
    p.velocity = force;
    p.gravity = Vector.create(0, 0.8);

    if(force.getX() > 0) {
        rot = '-=4';
    } else {
        rot = '+=4';
    }

    TweenMax.ticker.addEventListener('tick', tick);
    TweenMax.delayedCall(2, reset);
}

function tick() {
    let currY = p.position.getY();
    let currX = p.position.getX();

    if(hasThrow) {
        if(currY < 0) highEnough = true;

        if (highEnough) {
            if(lastY < currY && force.getLength() > 15) {
                basket.style.zIndex = 1;

                if(currY < 10 && currY > -10) {
                    hasThrow = false;

                    if(currX > basketWidth*0.1 && currX < basketWidth
                        || currX < -basketWidth*0.1 && currX > -basketWidth) {
                        force.setX(currX/10);
                        force.setLength(force.getLength()*0.7);
                        p.velocity = force;

                        basket.style.zIndex = 0;
                    } else if(currX <= basketWidth && currX >=  -basketWidth) {
                        score += 2;
                        hits += 1;

                        TweenMax.to('#net', 1, {scaleY: 1.1, transformOrigin: '50% 0', ease: Elastic.easeOut});
                        TweenMax.to('#net', 0.3, {scale: 1, transformOrigin: '50% 0', ease: Power2.easeInOut, delay: 0.6})
                    }
                }
            }
        }
    }

    p.update();
    TweenMax.set(ball, {x:p.position.getX, y: currY, rotation:rot});

    lastY = currY;
}

function reset() {
    TweenMax.ticker.removeEventListener('tick', tick);

    p.gravity = 0;

    hasThrow = false;
    highEnough = false;

    basket.style.zIndex = 0;

    ball.addEventListener('mousedown', grabBall);
    ball.addEventListener('touchstart', grabBall);

    updateScore();

    TweenMax.to(ball, 1, {
        x: 0,
        y: offsetY,
        scale: 1,
        rotation: 0,
        ease: Power3.easeOut
    })
}

function startPlay() {
    removeEvents();
    addEvents();

    offsetY = ball.getBoundingClientRect().height*1.5;

    ballRadius = Math.min(ball.getBoundingClientRect().width, ball.getBoundingClientRect().height);

    basketWidth = Math.round(basket.querySelector('rect').getBoundingClientRect().width);

    ratio = basketWidth / ballRadius - 0.1;

    w = window.innerWidth;
    h = window.innerHeight;

    TweenMax.set(ball, {clearProps: 'all'});

    TweenMax.set(ball, {y:'+='+offsetY});

    scale = TweenMax.to(ball, 0.5, {scale:ratio, ease: Power1.easeInOut}).progress(1).pause(0);
}

function updateScore() {
    accuracy = hits / shots;

    document.getElementById('shots').innerHTML = 'Shots: ' + shots;
    document.getElementById('hits').innerHTML = 'Score: ' + score;
    document.getElementById('accuracy').innerHTML = 'Accuracy: ' + Math.round(accuracy * 100) + '%';
}

startPlay();
