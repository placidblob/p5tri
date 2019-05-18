let FLOCK_SIZE = 500;

let MAX_X = 800;
let MAX_Y = 600;

let BALL_RADIUS = 8;
let GRAVITY = 2;
let FRICTION = 0.04;

let MAX_VELOCITY = 3 * GRAVITY;

let COZY = 8;
let COZY_DISTANCE = COZY * BALL_RADIUS;
let COZY_DISTANCE_SQ = COZY_DISTANCE * COZY_DISTANCE;
let LINE_OF_SIGHT = COZY_DISTANCE * 2;
let LINE_OF_SIGHT_SQ = LINE_OF_SIGHT * LINE_OF_SIGHT;

let tick = 0;

let ATTRACTIVE_FORCE = GRAVITY;

let STEP_EVERY_N_FRAMES = 5;


////////////////////////////
// UI

let VERT_PADDING = 8;

let framerateSlider, cozinessSlider, gravitySlider, flockSlider;
