function setup() {
  createCanvas(MAX_X,MAX_Y);

  for( let i = 0; i < FLOCK_SIZE; i++ )
    flock.push(new Ball(MAX_X,MAX_Y));
}

function draw() {
  background(51);

  for( let b of flock ) {
    b.show();
    b.step();
  }
}
