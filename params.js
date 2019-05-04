const zeBalls = [];

const FLOCK_SIZE = 20;

const MAX_X = 800;
const MAX_Y = 600;

const BALL_RADIUS = 8;
const GRAVITY = 2;
const FRICTION = 0.002;

const MAX_VELOCITY = 8 * GRAVITY;

const COZY = 8;
const COZY_DISTANCE = COZY * BALL_RADIUS;
const COZY_DISTANCE_SQ = COZY_DISTANCE * COZY_DISTANCE;
const LINE_OF_SIGHT = COZY_DISTANCE * 2;
const LINE_OF_SIGHT_SQ = LINE_OF_SIGHT * LINE_OF_SIGHT;

let tick = 0;

const ATTRACTIVE_FORCE = GRAVITY;