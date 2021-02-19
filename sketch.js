var PLAY = 1;
var END = 0;
var gameState = PLAY;

var tiger, tiger_running, tiger_collided;
var ground, invisibleGround, groundImage;

var coinGroup, coinImage;
var huntersGroup, hunter2, hunter1,hunter3;
var score=0;
var life=3;

var gameOver, restart;

localStorage["HighestScore"] = 0;

function preload(){
  tiger_running = loadAnimation("tigerrun.jpg");
  tiger_collided = loadAnimation("tigerdead.jpg");
  groundImage = loadImage("backg.jpg");
  
  coinImage = loadImage("coin.png");
  hunter2 = loadImage("hunter1.jpg");
  hunter1 = loadImage("hunter2.jpg");
  hunter3 = loadImage("hunter3.jpg");
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
}

function setup() {
  createCanvas(600, 500);
  tiger = createSprite(50,180,20,50);
  tiger.addAnimation("running", tiger_running);
  tiger.scale = 0.5;
  
  ground = createSprite(0,490,1200,10);
  ground.x = ground.width /2;
  ground.velocityX = -(6 + 3*score/100);
  
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  
  coinGroup = new Group();
  huntersGroup = new Group();
  
  score = 0;
}

function draw() {
  background("blue");
  textSize(20);
  fill(255);
  text("Score: "+ score, 500,40);
text("Life: "+ life , 500,60);
  drawSprites();
  if (gameState===PLAY){
  // score = score + Math.round(getFrameRate()/60);
    if(score >= 0){
      ground.velocityX = -6;
    }else{
      ground.velocityX = -(6 + 3*score/100);
    }
  
    if(keyDown("space") && tiger.y >= 139) {
      tiger.velocityY = -12;
    }
  
    tiger.velocityY = tiger.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    tiger.collide(ground);
    
    spawnCoin();
    spawnHunters();
  
   if(huntersGroup.isTouching(tiger)){
     life=life-1;
        gameState = END;
    } 
    if(coinGroup.isTouching(tiger)){
      score=score+1;
      coinSound.play();
      coinGroup[0].destroy();
    }
  }
  
  else if (gameState === END ) {
    gameOver.visible = true;
    restart.visible = true;
    text("restart",280,170);
    tiger.addAnimation("collided", tiger_collided);
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    tiger.velocityY = 0;
    huntersGroup.setVelocityXEach(0);
    coinGroup.setVelocityXEach(0);
    
    //change the trex animation
    tiger.changeAnimation("collided",tiger_collided);
    tiger.scale =0.35;
    
    //set lifetime of the game objects so that they are never destroyed
    huntersGroup.setLifetimeEach(-1);
    coinGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      if(life>0){
      reset();
    }
    }
  }
}

function spawnCoin() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var coin = createSprite(600,420,40,10);
    coin.y = Math.round(random(80,120));
    coin.addImage(coinImage);
    coin.scale = 0.1;
    coin.velocityX = -3;
    
     //assign lifetime to the variable
    coin.lifetime = 200;
    
    //adjust the depth
    coin.depth = tiger.depth;
    tiger.depth = tiger.depth + 1;
    
    //add each cloud to the group
    coinGroup.add(coin);
  }
  
}

function spawnHunters() {
  if(frameCount % 60 === 0) {
    var hunter = createSprite(600,465,10,40);    
    //generate random obstacles
    var rand = Math.round(random(1,3));
    switch(rand) {
      case 1: hunter.addImage(hunter2);
              break;
      case 2: hunter.addImage(hunter1);
              break;
      case 3: hunter.addImage(hunter3);
              break;
    }
        
    hunter.velocityX = -(6 + 3*score/100);
    
    //assign scale and lifetime to the obstacle           
    //hunter.scale = 0.2;
    hunter1.scale=0.2
    hunter.scale=0.1
    hunter.lifetime = 300;
    //add each obstacle to the group
    huntersGroup.add(hunter);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  huntersGroup.destroyEach();
  coinGroup.destroyEach();
  
  tiger.changeAnimation("running",tiger_running);
  tiger.scale =0.5;
  
  if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"] = score;
  }
  
  score = 0;
  
}