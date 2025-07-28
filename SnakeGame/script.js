const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const scale = 20;
const rows = canvas.height / scale;
const columns = canvas.width / scale;
const eatSound = document.getElementById('eatSound');
let snake;
let food;
let score = 0;

class Snake {
  constructor() {
    this.body = [{ x: 5 * scale, y: 5 * scale }];
    this.xSpeed = scale;
    this.ySpeed = 0;
  }

  draw() {
    ctx.fillStyle = '#228B22';
    for (let i = 0; i < this.body.length; i++) {
      const segment = this.body[i];
      ctx.beginPath();
      ctx.arc(segment.x + scale / 2, segment.y + scale / 2, scale / 2.1, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  update() {
    const head = {
      x: this.body[0].x + this.xSpeed,
      y: this.body[0].y + this.ySpeed
    };
    this.body.unshift(head);
    if (head.x === food.x && head.y === food.y) {
      food.pickLocation();
      eatSound.play();
      score += 10;
      document.getElementById('score').innerText = `Score: ${score}`;
    } else {
      this.body.pop();
    }
  }

  changeDirection(direction) {
    switch (direction) {
      case 'ArrowUp':
        if (this.ySpeed === 0) {
          this.xSpeed = 0;
          this.ySpeed = -scale;
        }
        break;
      case 'ArrowDown':
        if (this.ySpeed === 0) {
          this.xSpeed = 0;
          this.ySpeed = scale;
        }
        break;
      case 'ArrowLeft':
        if (this.xSpeed === 0) {
          this.xSpeed = -scale;
          this.ySpeed = 0;
        }
        break;
      case 'ArrowRight':
        if (this.xSpeed === 0) {
          this.xSpeed = scale;
          this.ySpeed = 0;
        }
        break;
    }
  }

  checkCollision() {
    const head = this.body[0];
    for (let i = 1; i < this.body.length; i++) {
      if (head.x === this.body[i].x && head.y === this.body[i].y) {
        this.reset();
      }
    }
    if (
      head.x >= canvas.width || head.x < 0 ||
      head.y >= canvas.height || head.y < 0
    ) {
      this.reset();
    }
  }

  reset() {
    this.body = [{ x: 5 * scale, y: 5 * scale }];
    this.xSpeed = scale;
    this.ySpeed = 0;
    score = 0;
    document.getElementById('score').innerText = `Score: ${score}`;
  }
}

class Food {
  constructor() {
    this.pickLocation();
  }

  pickLocation() {
    this.x = Math.floor(Math.random() * columns) * scale;
    this.y = Math.floor(Math.random() * rows) * scale;
  }

  draw() {
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(this.x + scale / 2, this.y + scale / 2, scale / 2.5, 0, Math.PI * 2);
    ctx.fill();
  }
}

function init() {
  snake = new Snake();
  food = new Food();
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  food.draw();
  snake.update();
  snake.draw();
  snake.checkCollision();
}

window.addEventListener('keydown', e => {
  snake.changeDirection(e.key);
});

init();
setInterval(gameLoop, 150);