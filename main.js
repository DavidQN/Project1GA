
window.onload = function(){

//initializes the cookie to gather highscore
function setCookie(score) {
  document.cookie = 'high_score=' + score + ';';
  //figure out how to add GMT string just like MDN states to declare how long the cookie will last and add more functionality to our little cookie nom nom nom
}

//value takes set cookie and places as a variable
function getCookie() {
  var value = document.cookie;
}

//the box the game is in
var gameBoard = {
  dom: document.getElementById('gameBoard'),
  height: 500,
  width: 500,
  gravity: 0.5
};

//telling the canvas that we are using 2d
var ctx = gameBoard.dom.getContext('2d');

//declaring the variable animation exists
var animation;

//playing 's starting is false until determined true (player playing)
var playing = false;

//score starts at 0
var score = 0;

//highscore starts at 0
var highScore = 0;
/////////////////////////////////////////////////////////////////////
///////////////////////////////bird //////////////////////////////////
/////////////////////////////////////////////////////////////////////

//properties of the bird
//where he begins on the X, Y axis
//the velocity for the x-axis and velocity for the y-axis
//the gravity he is subjected to
//the size: height and width
//his color
var bird = {
  x: 100,
  y: 100,
  vx: 0,
  vy: 0.5,
  gravity: 0.5,
  height: 25,
  width: 25,
  color: 'yellow',

  //function calling the already defined attributes of the bird
  //ctx.fillStyle = context(color) that you will fill this bird with which is yellow
  //ctx.fillRect(x,y,h,w) creating the location of the bird on the X,Y axis and the height and width
  draw: function() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.height, this.width);
  },

  //the flap function how much gravity is not affecting him when he flaps
  flap: function() {
    this.vy = -8;
  }
};
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////



/////////////////////////////////////////////////////////////////////
/////////////////////////     WALL    ///////////////////////////////
/////////////////////////////////////////////////////////////////////

//variable wall is the function of X,Y,H,W
//the parameters are defined(as themselves)
//pass is defined as false until proven true
var Wall = function(x, y, height, width) {
  this.x = x;
  this.y = y;
  this.height = height;
  this.width = width;
  this.pass = false;
};

//variable walls is created of a wall array
//length 0 (for now)
var walls = {
  wall: [],
  length: 0,

  //function with X,Y,H,W to add wall
  //calling the wall and adding(.push) a new Wall with the attributes of X,Y,H,W
  //than calls the length of 'walls' and adds another pipe
  //not entirely sure how += works, saw it used many times to add another
  add: function(x, y, height, width) {
    this.wall.push(new Wall(x, y, height, width));
    this.length += 1;
  },

  //function defining wall in this scope to wall.filter
  move: function() {
    this.wall = this.wall.filter(function(w) {
      w.x -= 2;
      return w.x + w.width >= 0;
    });
  },

  draw: function() {
    ctx.beginPath();
    this.wall.map(function(w) {
      ctx.rect(w.x, -1, w.width, w.y);
      ctx.rect(w.x, w.y + w.height, w.width, gameBoard.height - w.y - w.height + 1);
    });

    ctx.lineWidth = 1;
    ctx.strokeStyle = 'green';
    ctx.stroke();
  }
}

/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////

//function draw clearRect making it so the objects drawn don't paint the screen.
//has no X,Y axis and is the size of the canvas
//functions to make the walls and bird drawn.
//clear space of gameboard(clearRect)
function draw() {
  ctx.clearRect(0, 0, gameBoard.width, gameBoard.height);
  //call the function draw() from within the walls object and bird
  walls.draw();
  bird.draw();


  //if bird's Y axis and bird's Y velocity is less than(<) or equal(=) to 0
  //than it returns -bird.y axis
  //if false return bird Y velocity
  bird.vy = bird.y + bird.vy <= 0 ? -bird.y : bird.vy;
  //turnery that if the bird Y axis and the bird height and bird Y velocity is greater (>) than
  //the gameBoard height than it returns gameBoard.height=bird velocity (-) birds Y axis and birds height
  //if false return bird velocity=bird velocity
  bird.vy = bird.y + bird.height + bird.vy > gameBoard.height ? gameBoard.height - (bird.y + bird.height) : bird.vy;

  //checks that if the birds position of y axis and birds height is greater
  //or equal to game height then the game ends (activates the function gameOver)
  if (bird.y + bird.height >= gameBoard.height) {
    gameOver();
  }

  //grab the wall within the object walls and create a new array under a condition
  walls.wall.map(function(w) {
    //birds x axis and birds width must be greater than wall axis and birds X axis
    //it also must be greater than (>) or equal (=) too wall axis and wall width and
    //bird Y axis must be less than or equal to wall Y
    //testing if the bird touches the wall in any wall the game is over
    if (bird.x + bird.width >= w.x && bird.x <= w.x + w.width && (bird.y <= w.y || bird.y + bird.height >= w.y + w.height)) {
      gameOver();
    }
  });

  //if bird's X axis and birds width is greater than or equal too than wall within the object walls
  //determine everytime you pass the walls you score 1 point
  if (bird.x + bird.width >= walls.wall[0].x + walls.wall[0].width) {
    if (!walls.wall[0].pass) {
      walls.wall[0].pass = true;
      score += 1;

      //walls added will always be missing height for the box to go through
      walls.add(650, Math.floor(Math.random() * (gameBoard.height - 120)), 150, 50);
    }
  }

  //bird Y axis
  bird.y += bird.vy;
  bird.vy += gameBoard.gravity;

  //calling the move:function() inside the object walls
  walls.move();

  //if function start() is present (player clicked or clicked spacebar)
  //animation is equal too, the window is calling on the draw function to start
  //drawing before the repaint
  if (playing) {
    animation = window.requestAnimationFrame(draw);
  }

}

/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////

//click activates function for bird to flap
//if not than activate init() which is precusor before the game(ex.add walls, set score etc.)
gameBoard.dom.onclick = function() {
  if (playing) {
    bird.flap();
  } else {
    init();
  }

};

//when you keycode 32, which is spacebar is click it activates the
//bird flap function
//else init
window.onkeydown = function(event) {
  var key = event.charCode || event.keyCode;
  if (key === 32) {
    if (playing) {
      bird.flap();
    } else {
      init();
    }
  }
};

//game over function
//cancel all animation and set playing back to original state of false
//the highscore is determined by the gathered info from the cookie function
//show string game over + the score variable and next line (\n) highscore string with
//highscore variable
function gameOver() {
  console.log('gameover');
  window.cancelAnimationFrame(animation);
  playing = false;
  highScore = Math.max(highScore, score);
  setCookie(highScore);
  showMessage('Game Over!\nScore: ' + score + '\nHigh Score: ' + highScore);
}

/////////////////////////////////////////////////////////////////////
/////////////////////    POP-UP MESSAGE      /////////////////////////////
/////////////////////////////////////////////////////////////////////


function showMessage(message) {
  ctx.fillStyle = 'white';
  ctx.textAlign = 'center';
  ctx.font = "bold 20px 'Fredericka the Great', cursive";
  //apparently you're supposed to use Array.prototype.map.call instead of
  //array.map.call from stackoverflow. Still a little confused on this part
  //stackoverflow
  Array.prototype.map.call(message.split('\n'), function(m, index) {
    //fills textbox
    ctx.fillText(m, gameBoard.width / 2, gameBoard.height / 2 + index * 20);
  });
}


/////////////////////////////////////////////////////////////////////
///////////////////       ADDING RANDOM WALLS   ///////////////////////
/////////////////////////////////////////////////////////////////////

//initialize the game
//set score to 0
//if highscore does not equal getcookie() (the highscore gatherer) than set the score to 0
//bird starts on Y axis 100
//wall inside walls object is set
//the add new walls function is called from the walls object
//to add more walls every 200 pixels from each other
//the height of each 3 boxes created randomly by
//first determining a random number between 0 and 1 (math.random)
//then that is multiplied by (the gameBoard height as to not be beyond board height
//that is than subtracted by 150 as to create enough space for the bird to go through)
function init() {
  score = 0;
  highScore = getCookie() ? getCookie() : 0;
  bird.y = 100;
  walls.wall = [];
  walls.add(350, Math.floor(Math.random() * (gameBoard.height - 150)), 150, 50);
  walls.add(550, Math.floor(Math.random() * (gameBoard.height - 150)), 150, 50);
  walls.add(750, Math.floor(Math.random() * (gameBoard.height - 150)), 150, 50);

  //function to call the start function for the game to begin
  start();
}

/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////

//function to start the game, sets playing to true and calls the function draw()
//to start crafting the board
function start() {
  playing = true;
  draw();
}

//calls the function to set up the game board scores, highscore etc.
init();

}

