let input, button;
let on = false;

class Ball{

  static zeBalls = [];

  static setup() {
    createCanvas(MAX_X,MAX_Y);

    for( let i = 0; i < FLOCK_SIZE; i++ )
      Ball.zeBalls.push(new Ball(MAX_X,MAX_Y));

    // create canvas
    // createCanvas(710, 400);



    button = createButton('on/off');
    button.position(20, 610);
    button.mousePressed(Ball.clicked);

    Ball.initSliders(button.x, button.y + button.height + VERT_PADDING);

  }

  static initSliders(x, y) {

    let lastSlider; 
    
    framerateSlider = createSlider(1, 30, STEP_EVERY_N_FRAMES, 1);
    framerateSlider.position(x, y);
    framerateSlider.changed(Ball.readParams);
    lastSlider = framerateSlider;
    
    cozinessSlider = createSlider(1, 30, COZY, 1);
    cozinessSlider.position(lastSlider.x, lastSlider.y + lastSlider.height + VERT_PADDING);
    cozinessSlider.changed(Ball.readParams);
    lastSlider = cozinessSlider;
    
    gravitySlider = createSlider(1, 30, GRAVITY, 1);
    gravitySlider.position(lastSlider.x, lastSlider.y + lastSlider.height + VERT_PADDING);
    gravitySlider.changed(Ball.readParams);
    lastSlider = gravitySlider;

    flockSlider = createSlider(1, 1500, FLOCK_SIZE, 10);
    flockSlider.position(lastSlider.x, lastSlider.y + lastSlider.height + VERT_PADDING);
    flockSlider.changed(Ball.readParams);
  }


  static clicked() {
    on = !on;
  }

  static readParams() {

    STEP_EVERY_N_FRAMES = Ball.sliderVal(framerateSlider);

    COZY = Ball.sliderVal(cozinessSlider);
    COZY_DISTANCE = COZY * BALL_RADIUS;
    COZY_DISTANCE_SQ = COZY_DISTANCE * COZY_DISTANCE;
    LINE_OF_SIGHT = COZY_DISTANCE * 2;
    LINE_OF_SIGHT_SQ = LINE_OF_SIGHT * LINE_OF_SIGHT;

    GRAVITY = Ball.sliderVal(gravitySlider);
    MAX_VELOCITY = 3 * GRAVITY;

    FLOCK_SIZE = Ball.sliderVal(flockSlider);
  }

  static sliderVal(slider) {
    return Number(slider.evt.value);
  }

  // TODO: animated gif stuff - https://gist.github.com/antiboredom/129fd2311dec0046603e

  static draw() {
    tick++;

    background(51);

    for( let b of Ball.zeBalls ) {
      b.show();

      if( on && tick % STEP_EVERY_N_FRAMES == 0 )
        b.step(tick);
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

    this.balls = Ball.zeBalls;

    this.pos = createVector(random(0,maxX), random(0,maxY));
    this.vel = p5.Vector.random2D();

    this.vel.setMag(random(2, 5));

    this.maxX = maxX;
    this.maxY = maxY;

    this.colour = color(random(128,255), random(128,255), random(128,255));

    this.radius = random(0.75*BALL_RADIUS, 1.25*BALL_RADIUS);

    this.attract = random(0, 1) < 0.5;

    if( this.attract )
      this.colour = color(100,255,100);
    else
      this.colour = color(255,100,100);
  }

  getAttractiveForce(balls) {
    const rtrn = createVector();

    balls.forEach(b => {
      const force = createVector(b.pos.x - this.pos.x, b.pos.y - this.pos.y);

      const distSq = this.distanceSq(b);

      force.setMag((distSq - COZY_DISTANCE_SQ) / COZY_DISTANCE_SQ );

      rtrn.add(force);
    });

    rtrn.setMag(ATTRACTIVE_FORCE);

    return rtrn;
  }

  getNeighbours() {
    const rtrn = [];

    for( let ball of Ball.zeBalls )
      if( this.distanceSq(ball) < LINE_OF_SIGHT_SQ )
        rtrn.push(ball);

    return rtrn;
  }

  distanceSq(ball) {
    const diffx = this.pos.x - ball.pos.x;
    const diffy = this.pos.y - ball.pos.y;

    return diffx * diffx + diffy * diffy;
  }

  step(tick) {
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

    const attraction = () => {
      const attr = this.getAttractiveForce(this.getNeighbours());

      this.vel.add(attr);
    };

    const repulsion = () => {
      const attr = this.getAttractiveForce(this.getNeighbours());

      this.vel.sub(attr);
    };

    const limitVelocity = () => {
      if( this.vel.mag() > MAX_VELOCITY )
        this.vel.setMag(MAX_VELOCITY);
    };

    // deflectY();
    // deflectX();
    pacmanX();
    pacmanY();

    // gravity();
    friction();

    if( this.attract )
      attraction();
    else
      repulsion();

    limitVelocity();

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
