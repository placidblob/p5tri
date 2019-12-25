class Ball{

  static zeBalls = [];

  static setup() {
    createCanvas(MAX_X,MAX_Y);

    for( let i = 0; i < FLOCK_SIZE; i++ )
      Ball.zeBalls.push(new Ball(MAX_X,MAX_Y));
  }

  // TODO: animated gif stuff - https://gist.github.com/antiboredom/129fd2311dec0046603e

  static draw() {
    tick++;

    background(51);

    for( let b of Ball.zeBalls ) {
      b.show();
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

    this.radius = BALL_RADIUS;
    // this.radius = random(0.75*BALL_RADIUS, 1.25*BALL_RADIUS);
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

  getRepulsiveForce(balls) {
    const rtrn = createVector();

    balls.forEach(b => {
      const force = createVector(b.pos.x - this.pos.x, b.pos.y - this.pos.y);

      const distSq = this.distanceSq(b);

      if(distSq >= COZY_DISTANCE_SQ)
        return;

      force.setMag((COZY_DISTANCE_SQ - distSq) / COZY_DISTANCE_SQ);

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

  getColour = (baseColour = true) => {
    return this.colour;
  };

  configurations = {
    efervescent: {
      title: "Efervescent",
      description: "ends up looking like gas molecules escaping a liquid",
      behaviour: {
        // all walls are solid
        deflectX: true,
        deflectY: true,
        pacmanX: false,
        pacmanY: false,

        // gravity and friction
        gravity: true,
        fiction: true,

        // no attraction, just repel neighbours
        attraction: false,
        repulsion: true,

        limitVelocity: true
      }
    },
    stream: {
      title: "Stream",
      description: "they self-organise to act as a stream",
      velocity: 4,
      behaviour: {
        // ceil and floor are pacman, walls are solid
        deflectX: true,
        deflectY: false,
        pacmanX: false,
        pacmanY: true,

        // gravity and friction
        gravity: true,
        fiction: true,

        // attraction and repulsion
        attraction: true,
        repulsion: true,

        limitVelocity: true
      }
    },
    experimental: {
      title: "placeholder for experimentation",
      description: "",
      behaviour: {
        // ceil and floor are pacman, walls are solid
        deflectX: false,
        deflectY: false,
        pacmanX: true,
        pacmanY: true,

        // gravity and friction
        gravity: false,
        fiction: true,

        // attraction and repulsion
        attraction: true,
        repulsion: true,

        limitVelocity: true
      }
    },
  };

  step() {
    const config = this.configurations.experimental.behaviour;

    const neighbours = this.getNeighbours();

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
      const attr = this.getAttractiveForce(neighbours);

      this.vel.add(attr);
    };

    const repulsion = () => {
      const attr = this.getRepulsiveForce(neighbours);

      this.vel.sub(attr);
    };

    const limitVelocity = () => {
      if( this.vel.mag() > MAX_VELOCITY )
        this.vel.setMag(MAX_VELOCITY);
    };

    config.deflectX && deflectX();
    config.deflectY && deflectY();
    config.pacmanX && pacmanX();
    config.pacmanY && pacmanY();

    config.gravity && gravity();
    config.friction && friction();

    config.attraction && attraction();
    config.repulsion && repulsion();

    config.limitVelocity && limitVelocity();

    this.pos.add(this.vel);
  }

  show() {
    strokeWeight(this.radius * 2);
    stroke(this.getColour());
    point(this.pos.x, this.pos.y);
  }

  static saveScreenshot(filename, extension = 'png') {
    saveCanvas(filename, extension);
  }
}
