console.log('Client-side code running');

let myGamePiece;//cue piece
let balls = [];//array for balls
let redballs = [];
let ballsLength = 15;//number of red balls
let pockets = [];//array for pockets
let ctx;//context
let ballCount = 21;//total number of balls
let numBalls = 10;
let bounce = -0.5;
let spring = 0.03;

const gravity = 0.05;
let gravitySpeed = 0;
let dx = -.5;
let dy = .5;
let playerScore = 0;

//to zero-ize mongo database score object on refresh
updateScore();

function startGame(){

  myGameArea.start();
  //instantiating a new object
  myGamePiece = new Cue(175, 500, "#fff", 30, 30);

  //spawn 15 red balls with for loop
  for (let i = 0; i < ballsLength; i ++){
     balls.push(new Ball());
  }
  //add individual ball to balls array
  balls.push(yellowBall, greenBall, brownBall, blueBall, pinkBall, blackBall);

  //add individual pocket to pockets array
  pockets.push(pocket1, pocket2, pocket3, pocket4, pocket5, pocket6);

  //render the red balls in triangle
  render();

}

//render RED balls only into snooker 15 red ball triangle at start
function render(){
  //console.log("pyramid");
  let numRows = 5;//number of rows for redballs set up
  //console.log(redballs);
  let ballNum = 0;//counter for adding redballs
  let x;
  let y = 110//starting point for y coord

//only do this if the ball color in ball array is red
if (balls[0].col === "#b20000") {
  //outer loop is for rows of inverted pyramid shape
  for(let row = numRows - 1; row >= 0; row--){
    y += 15; //ball[0] y position starts at 125 (110 + 15)
    x = 185 - (7.5*row); // resetting starting point (ball[0] x position starts at 155 (185 - 7.5 + row which is 4 = 155))
    //inner loop is for columns of inverted pyramid shape
    for(let col = 0; col <= row; col++){
        x += 15;//ball[0] starts at 155 + 15 = 170
        //so ball[0] draws at x= 170 and y = 125
        balls[ballNum].x = x;
        balls[ballNum].y = y;
        ballNum++;
      }
    }
  }
}

// return true if the rectangle and circle are coliding
function RectCircleColliding(Ball, myGamePiece) {
    let distX = Math.abs(Ball.x - myGamePiece.x - myGamePiece.width / 2);
    let distY = Math.abs(Ball.y - myGamePiece.y - myGamePiece.height / 2);
    if (distX > (myGamePiece.width / 2 + Ball.r)) {
        return false;
        console.log("false");
    }
    if (distY > (myGamePiece.height / 2 + Ball.r)) {
        return false;
        console.log("false");
    }
    if (distX <= (myGamePiece.width / 2)) {
        return true;
        console.log("true");
    }
    if (distY <= (myGamePiece.height / 2)) {
        return true;
        console.log("true");
    }
    let dx = distX - myGamePiece.width / 2;
    let dy = distY - myGamePiece.height / 2;
    return (dx * dx + dy * dy <= (Ball.r * Ball.r));
}

//function calculating the distance between two points (xy of balls and xy of pockets)
//called in update to enable collision detection between balls and pockets
function getDistance(x1, y1, x2, y2){
  let xDist = x2 - x1;
  let yDist = y2 - y1;

  return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
}

//function called to update player score
function updateScore(){
  let data = {
    "score": playerScore
  };

  fetch('/scored', {
    method: 'POST',
    body: JSON.stringify({
      data
    }),
    headers: new Headers({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    })
  })
  .then(function(response){
    //call GET here
    if(response.ok){
      console.log('Score was recorded');
      return;
    }
    throw new Error('Request failed.');
  })
  .catch(function(error) {
    console.log(error);
  });
}


//move Ball functions called after collision detection between myGamePiece (cue) and hit balls
function move1(Ball){
    console.log("moveUp");
    Ball.vx = 0;
    Ball.vy += 5;
};
function move2(Ball){
    console.log("moveDown");
    Ball.vx = 0;
    Ball.vy -= 5;
};
function move3(Ball){
    console.log("moveleft");
    Ball.vx -= 5;
    Ball.vy = 0;
};
function move4(Ball){
    console.log("moveright");
    Ball.vx += 5;
    Ball.vy = 0;
};

//creating empty canvas / game area object with own properties for canvas and start
let myGameArea = {
  canvas: document.createElement("canvas"),
  start: function(){
    this.canvas.width = 400;
    this.canvas.height = 800;
    this.context = this.canvas.getContext("2d");
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.interval = setInterval(updateGameArea, 20);// 20 run update game area function every 20th millisecond or 50 times per second
    window.addEventListener('keydown', function (e){
      //myGameArea.key = e.keycode || e.which;//needed to add e.which here as e.keycode alone not working ... event.which normalizes event.keyCode and event.charCode
      myGameArea.keys = (myGameArea.keys || []);//for multiple key press for diagonal movement
      myGameArea.keys[e.which] = true;//insert one element for each key pressed
    })
    window.addEventListener('keyup', function (e){
      // myGameArea.key = false;
      myGameArea.keys[e.which] = false;
    })
  },
  clear: function(){
    //console.log("test3");
    this.context.clearRect(0,0, this.canvas.width, this.canvas.height);
  }
}

//function make game action ready with frames
function updateGameArea(){

  balls.forEach(function(Ball){
    //console.log("array");
    if (RectCircleColliding(Ball, myGamePiece)) {
      //console.log("collision detection");

          if (Ball.x > myGamePiece.x && Ball.y > myGamePiece.y){
            console.log("topHit");
            move1(Ball);
          }
          else if(Ball.x >= myGamePiece.x && Ball.y < myGamePiece.y){
            console.log("bottomHit");
            move2(Ball);
          }
          //this right direction element is not functioning correctly
          else if (Ball.x >= myGamePiece.x){
            console.log("rightHit");
            move4(Ball);
          }
          else if (Ball.x <= myGamePiece.x){
            console.log("leftHit");
            move3(Ball);
          }
        //  console.log("hit");
      } else {
          //console.log("no hit");
      }});

    myGameArea.clear();

    myGamePiece.speedX = 0;
    myGamePiece.speedY = 0;
    //for arrow control using multiple keys
    if(myGameArea.keys && myGameArea.keys[37]){myGamePiece.speedX = -1;}
    if(myGameArea.keys && myGameArea.keys[39]){myGamePiece.speedX = 1;}
    if(myGameArea.keys && myGameArea.keys[38]){myGamePiece.speedY = -1;}
    if(myGameArea.keys && myGameArea.keys[40]){myGamePiece.speedY = 1;}

    myGamePiece.newPos();
    myGamePiece.update();
    myGamePiece.collisionWithWall(myGameArea.canvas.width, myGameArea.canvas.height);

    balls.forEach(function(ball){
      ball.collisionWithWall(myGameArea.canvas.width, myGameArea.canvas.height);
      ball.draw();

      ball.move();
    });

    pockets.forEach(function(pocket){
    pocket.draw();
  });

//collision detection for balls hitting pockets[] array
  for(i = 0; i < balls.length; i++){
    for(j = 0; j < pockets.length; j++){
        //console.log(getDistance (balls[i].x, balls[i].y, pockets[j].x, pockets[j].y));
        if(getDistance(balls[i].x, balls[i].y, pockets[j].x, pockets[j].y) <  balls[i].r + pockets[j].r){
          // add ball points to playerScore 
          playerScore += balls[i].points;
          console.log('score ' + playerScore);
          updateScore();
          //display the updated score
          document.getElementById("playerScore").innerHTML = "Local Score: " + playerScore;
          console.log('number of balls before ' + balls.length);
          //remove this ball object from the balls array
          balls.splice(this.i, 1);
          console.log('number of balls now ' + balls.length);
        }
      }
    }
}

//create Ball class - parent class
class Ball{
  constructor(x = 100, y = 100, col = "#b20000", points = 1, vx = 0, vy = 0, r = 7.5){
    this.x = x;
    this.y = y;
    this.col = col;
    this.points = points;
    this.r = r;
    this.vx = 0; //speedX
    this.vy = 0; //speedY
  }

  draw(x, y){
    if (x) {
      this.x = x;
    }
    if (y) {
      this.y = y;
    }
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
    ctx.fillStyle = this.col;
    ctx.fill();
    ctx.closePath();
  }

  move(){
    this.x += this.vx;
    this.y += this.vy;

    if(this.vx > 0){
      this.vx --;
    }
    if (this.vx < 0){
      this.vx ++;
    }
    if(this.vy > 0){
      this.vy --;
    }
    if (this.vy < 0){
      this.vy ++;
    }
  }

  collisionWithWall(width, height) {
    if (this.x + this.r > width) {
      console.log("right");
      this.x = width - this.r;
      this.vx *= -1;
    } else if(this.x - this.r < 0) {
      console.log("left");
      this.x = 0 + this.r;
      this.vx *= -1;
    }
    if (this.y + this.r > height) {
      console.log("bottom");
      this.y = height - this.r;
      this.vy *= -1;
    } else if (this.y - this.r < 0) {
      console.log("top");
      this.y = 0 + this.r;
      this.vy *= -1;
    }
    return this;
  }
}//end of Ball class

//child objects of Ball class using ES6 syntactic sugar for classical model for inheritance
//these are my cats and dogs ES6 inherited from Ball class
const yellowBall = new Ball(250,600, "#ffbd3f", 2);
const greenBall = new Ball(150,600, "#004000", 3);
const brownBall = new Ball(200,600, "#802b00", 4);
const blueBall = new Ball(200,400, "#0000ff", 5);
const pinkBall = new Ball(200,205, "#ff00ff", 6);
const blackBall = new Ball(200,100, "#000000", 7);
//const orangeBall = new Ball(100,100, "#ffa500", 7);//used for singular ball testing purposes only


//this is my Reptile ES6 inherited from Ball class
class Cue extends Ball{
  constructor(x, y, col, width, height){
    super(x, y, col);
    this.width = width;
    this.height = height;
    this.speedX = 50//for gamePiece
    this.speedY = 50;
  }
  //additional functions not inherited from Ball class
update(){
  ctx = myGameArea.context;
  ctx.fillStyle = this.col;
  ctx.fillRect(this.x, this.y, this.width, this.height);
  }
newPos(){
  this.x += this.speedX;
  this.y += this.speedY;
  }
}


//this is another 'Reptile' ES6 inherited from Ball class
class Pocket extends Ball{
  constructor(x, y, col, points, vx, vy, r){
    super(x, y, col = "#000", points = 0, vx, vy, r = 20);
  }
  //own draw function overriding that of Ball class
  draw(){
    //console.log("circle" + this.x + this.y + this.col);
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
    ctx.fillStyle = this.col;
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.strokeStyle = "#7F440D";
    ctx.stroke();
  }
}
//child objects of Pocket class using ES6 syntactic sugar for classical model for inheritance
//these are my crocs as children of my second Reptile ES6 inherited from Ball class
const pocket1 = new Pocket(15,15);
const pocket2 = new Pocket(385,15);
const pocket3 = new Pocket(15,400);
const pocket4 = new Pocket(385,400);
const pocket5 = new Pocket(15,785);
const pocket6 = new Pocket(385,785);


//use API endpoint '/scored'
//setInterval function polls the server every second to retrieve the score data and will update the score
setInterval(function() {
  fetch('/scored', {method: 'GET'})
    .then(function(response) {
      if(response.ok) return response.json();
      throw new Error('Request failed.');
    })
    .then(function(data) {
      document.getElementById('counter').innerHTML = `Current Score from Mongo DB is ${data[0]['score']}`;
      if(data[0]['score'] === 42){
        document.getElementById('status').innerHTML = `Game Over!`;}

    })
    .catch(function(error) {
      console.log(error);
    });
}, 1000);
