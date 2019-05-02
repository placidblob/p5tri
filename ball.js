class Ball{

  static setup() {
    createCanvas(MAX_X,MAX_Y);

    for( let i = 0; i < FLOCK_SIZE; i++ )
      flock.push(new Ball(MAX_X,MAX_Y));
  }

  // TODO: animated gif stuff - https://gist.github.com/antiboredom/129fd2311dec0046603e

  static draw() {
    tick++;

    background(51);

    for( let b of flock ) {
      b.show();
      b.step();
    }

    // if( tick < 1000 )
    //   Ball.saveScreenshot( "balls-" + Ball.leadingZeroes(tick, 3) );
  }

  static leadingZeroes(num, len = 3) {
    let rtrn = '0' + num;

    for(let i = 1; i < len - 1; i++)
      rtrn = '0' + rtrn;

    return rtrn.slice(-len);
  }

  constructor( maxX , maxY ) {
    this.pos = createVector(random(0,maxX), random(0,maxY));
    this.vel = p5.Vector.random2D();

    this.vel.setMag(random(2, 5));

    this.maxX = maxX;
    this.maxY = maxY;

    this.colour = color(random(128,255), random(128,255), random(128,255));

    this.radius = random(0.75*BALL_RADIUS, 1.25*BALL_RADIUS)
  }

  getNeighbours(balls) {
    const rtrn = [];

    for( let ball of balls )
      if( this.distanceSq(ball) < LINE_OF_SIGHT_SQ )
        rtrn.push(ball);

     return rtrn;
  }

  distanceSq(ball) {
    const diffx = this.pos.x - ball.pos.x;
    const diffy = this.pos.y - ball.pos.y;

    return diffx * diffx + diffy * diffy;
  }

  step() {
    const deflectX = () => {
      if (this.pos.x + this.radius > this.maxX || this.pos.x < this.radius) {
        this.vel.x *= -1;

        this.pos.x = (this.pos.x < this.radius)? this.radius : this.maxX - this.radius;
      }
    };

    const deflectY = () => {
      if (this.pos.y + this.radius > this.maxY || this.pos.y < this.radius) {
        this.vel.y *= -1;

        this.pos.y = (this.pos.y < this.radius)? this.radius : this.maxY - this.radius;
      }
    };

    const pacmanX = () => {
      if (this.pos.x > this.maxX)
        this.pos.x -= this.maxX;
      else if (this.pos.x < 0)
        this.pos.x += this.maxX;
    };

    const pacmanY = () => {
      if (this.pos.y > this.maxY)
        this.pos.y -= this.maxY;
      else if (this.pos.y < 0)
        this.pos.y += this.maxY;
    };

    const gravity = () => {
      let g = createVector(0, GRAVITY);
      this.vel.add(g);
    };

    const friction = () => {
      this.vel.mult(1-FRICTION);
    };

    deflectX();
    // pacmanX();
    deflectY();

    gravity();
    friction();

    this.pos.add(this.vel);

  }

  show() {
    strokeWeight(this.radius * 2);
    stroke(this.colour);
    point(this.pos.x, this.pos.y);
  }

  static saveScreenshot(filename, extension = 'png') {
    saveCanvas(filename, extension);
  }
}
