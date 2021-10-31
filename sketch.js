var score = 0;
var gameState = "play";
var reset;
var bulletCount = 15;
var powerup;

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  rocket = createSprite(75, 300, 50, 25);
  rocket.addImage("rocket", rocketImage);
  rocket.scale = 0.65;

  alienGroup = new Group();
  bulletGroup = new Group();
  powerupGroup = new Group();

  gameover = createSprite(windowWidth/2, windowHeight/2);
  gameover.addImage("gameover", gameoverImage);
  gameover.scale = 0.1
  gameover.visible = false;
}

function preload(){
  bgImage = loadImage("images/background.gif");
  alienImage = loadAnimation("images/a1.png", "images/a2.png", "images/a3.png", "images/a4.png", "images/a5.png",
  "images/a6.png", "images/a7.png", "images/a8.png", "images/a9.png", "images/a10.png", "images/a11.png",
  "images/a12.png", "images/a13.png", "images/a14.png", "images/a15.png", "images/a16.png");
  rocketImage = loadImage("images/R.png");
  bulletImage = loadImage("images/fireball.png");
  explosionImage = loadAnimation("images/e1.gif", "images/e2.gif", "images/e3.gif", "images/e4.gif", "images/e5.gif",
  "images/e6.gif", "images/e7.gif", "images/e8.gif", "images/e9.gif", "images/e10.gif", "images/e11.gif", "images/e12.gif",
  "images/e13.gif", "images/e14.gif", "images/e15.gif", "images/e16.gif", "images/e17.gif");
  shootingSound = loadSound("shooting.wav");
  explosionSound = loadSound("explosion.mp3");
  gameoverImage = loadImage("images/gameover.png");
  bg2Image = loadImage("images/bg2.jpg");
  powerupImg = loadImage("images/1.png", "images/2.png", "images/3.png");
}

function draw() {
  background(0);
  image(bgImage, 0, 0, width, height)
  spawnAliens();
  drawSprites();
  spawnPowerUp();

  if(gameState === "play"){
    if(keyDown(DOWN_ARROW)){
      rocket.velocityY = 5
    }
  
    if(keyDown(UP_ARROW)){
      rocket.velocityY = -5
    }
  
    if(keyWentDown("SPACE")){
      spawnBullets();
      shootingSound.play();
      bulletCount = bulletCount - 1;
    }
    
    if (alienGroup.isTouching(rocket)) {
      gameState = "end";
    }

    if(score >= 15){
      image(bg2Image, 0, 0, width, height)
      drawSprites();
      alienGroup.setVelocityXEach(-4);
    }

    if(score >= 30){
      image(bgImage, 0, 0, width, height)
      drawSprites();
      alienGroup.setVelocityXEach(-5);
    }
    
    if(bulletCount <= 0){
      gameState = "end"
    }

    fill("white");
    textSize(30)
    text("Score " + score, windowWidth/2, 50);

    fill("white");
    textSize(30)
    text("Bullets " + bulletCount, windowWidth/4, 50);


    for (let i = 0; i < bulletGroup.length; i++) {
      for (let j = 0; j < alienGroup.length; j++) {
        if(bulletGroup.get(i) !== undefined && alienGroup.get(j) !== undefined){
          if (bulletGroup.get(i).isTouching(alienGroup.get(j))) {
            alienGroup.get(j).changeAnimation("explosion", explosionImage);
            explosionSound.play();
            alienGroup.get(j).scale = 0.4
            bulletGroup.get(i).destroy();
            score = score + 1;
            setTimeout(() => {
              alienGroup.get(j).destroy();
            }, 2000);
            
          }
        }
        
      }
      
    }
  
  }

  if(powerupGroup.isTouching(rocket)){
    bulletCount + 1;
  }

  if(gameState === "end"){
    rocket.velocityY = 0;
    alienGroup.setVelocityXEach(0);
    alienGroup.destroyEach();
    bulletGroup.destroyEach();
    powerupGroup.setVelocityXEach(0)
    powerupGroup.destroyEach();
    gameover.visible = true;

    score = 0;
    bulletCount = 15;

    if(mousePressedOver(gameover)){
      reset();
    }
  }
}




function spawnAliens(){
  if(frameCount % 100 == 0){
    alien = createSprite(width - 20, random(height - 500, height - 100));
    alien.addAnimation("alien", alienImage);
    alien.addAnimation("explosion", explosionImage);
    alien.velocityX = -3;
    alien.scale = 0.7

    alienGroup.add(alien);
    alien.lifetime = 400;
  }
}

function spawnBullets(){
  bullet = createSprite(rocket.x + 20, 300, 20, 10);
  bullet.addImage(bulletImage);
  bullet.scale = 0.04;
  bullet.velocityX = 5;
  bulletGroup.add(bullet);

  bullet.x = rocket.x
  bullet.y = rocket.y

  bulletGroup.add(bullet);
}

function reset(){
  gameState = "play";
  gameover.visible = false;
}

function spawnPowerUp(){
  if(frameCount % 150 == 0){
    powerup = createSprite(width - 20, random(height - 500, height - 100));
    powerup.addImage(powerupImg);
    powerup.velocityX = -3;
    powerup.scale = 0.1
    powerupGroup.add(powerup);
  }
}