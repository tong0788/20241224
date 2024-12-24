 // 精靈圖配置
  let sprites = {
  player1: {
    idle: { img: null, width: 253/6, height: 49, frames: 6 },
    walk: { img: null, width: 97/4, height: 45, frames: 4 },
    jump: { img: null, width: 233/7, height: 45, frames: 7 }
  },
  player2: {
    idle: { img: null, width: 343/12, height: 30, frames: 12 },
    walk: { img: null, width: 285/10, height: 39, frames: 10 },
    jump: { img: null, width: 772/21, height: 45, frames: 21 }
  },
  bullet: {
    img: null,
    width: 20,
    height: 20,
    frames: 4
  },
  explosion: {
    img: null,
    width: 32,
    height: 32,
    frames: 8
  }
  };

// 背景圖片
let backgroundImg;

  // 玩家1設定
  let player1 = {
  x: 845,
  y: 100,
  speedX: 5,
  speedY: 1,
  gravity: 0.8,
  jumpForce: -15,
  isJumping: false,
  groundY: 650,
  currentFrame: 0,
  currentAction: 'idle',
  direction: 1,
  bullets: [],
  health: 100
  };
  
  // 玩家2設定
  let player2 = {
  x: 1200,
  y: 100,
  speedX: 5,
  speedY: 1,
  gravity: 0.8,
  jumpForce: -15,
  isJumping: false,
  groundY: 650,
  currentFrame: 0,
  currentAction: 'idle',
  direction: -1,
  bullets: [],
  health: 100
  };

  // 載入資源
  function preload() {
 // 載入背景圖片
  backgroundImg = loadImage('background/01.png');
  // 載入玩家1的動作
  sprites.player1.idle.img = loadImage('player1/idle.png');
  sprites.player1.walk.img = loadImage('player1/walk.png');
  sprites.player1.jump.img = loadImage('player1/jump.png');
  
  // 載入玩家2的動作
  sprites.player2.idle.img = loadImage('player2/idle.png');
  sprites.player2.walk.img = loadImage('player2/walk.png');
  sprites.player2.jump.img = loadImage('player2/jump.png');
  
  // 載入子彈和爆炸效果
  sprites.bullet.img = loadImage('Air/01.png');
  sprites.explosion.img = loadImage('ex/0.png');

  
  }
  
  // 初始化設定
  function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);
  frameRate(60);
  }
  // 主要遊戲循環
  function draw() {
    // 繪製背景
    image(backgroundImg, width/2, height/2, width, height);
    fill("#4ecdc4") //顏色
    textSize(50) //設定文字大小為50
    text("TKUET",1140,50) 
  // 更新物理
  updatePhysics(player1);
  updatePhysics(player2);
  
  // 檢查按鍵
  checkKeys();
  
  // 檢查碰撞
  checkCollisions();
  
  // 繪製角色
  drawCharacter(player1, sprites.player1);
  drawCharacter(player2, sprites.player2);
  
  // 繪製子彈
  drawBullets(player1);
  drawBullets(player2);
  
    // 繪製生命值（移到最後，確保顯示在最上層）
    drawHealth();
  }
  
  // 更新物理
  function updatePhysics(player) {
  // 應用重力
  if (player.y < player.groundY) {
    player.speedY += player.gravity;
    player.isJumping = true;
  }
  
  // 更新垂直位置
  player.y += player.speedY;
  
  // 檢查著地
  if (player.y >= player.groundY) {
    player.y = player.groundY;
    player.speedY = 0;
    player.isJumping = false;
    if (player.currentAction === 'jump') {
      player.currentAction = 'idle';
    }
  }
  
  // 限制在畫面內
  if (player.x < 0) player.x = 0;
  if (player.x > width - sprites.player1.idle.width) {
    player.x = width - sprites.player1.idle.width;
  }
  }
  
  // 檢查按鍵輸入
  function checkKeys() {
  // 玩家1控制 (WASD)
  if (keyIsDown(65)) { // A
    player1.x -= player1.speedX;
    player1.direction = -1;
    player1.currentAction = 'walk';
  } else if (keyIsDown(68)) { // D
    player1.x += player1.speedX;
    player1.direction = 1;
    player1.currentAction = 'walk';
  } else if (!player1.isJumping) {
    player1.currentAction = 'idle';
  }
  
  if (keyIsDown(87) && !player1.isJumping) { // W
    player1.speedY = player1.jumpForce;
    player1.isJumping = true;
    player1.currentAction = 'jump';
  }
  
  // 玩家2控制 (方向鍵)
  if (keyIsDown(LEFT_ARROW)) {
    player2.x -= player2.speedX;
    player2.direction = -1;
    player2.currentAction = 'walk';
  } else if (keyIsDown(RIGHT_ARROW)) {
    player2.x += player2.speedX;
    player2.direction = 1;
    player2.currentAction = 'walk';
  } else if (!player2.isJumping) {
    player2.currentAction = 'idle';
  }
  
  if (keyIsDown(UP_ARROW) && !player2.isJumping) {
    player2.speedY = player2.jumpForce;
    player2.isJumping = true;
    player2.currentAction = 'jump';
  }
  }
  
  // 按鍵事件處理
  function keyPressed() {
  // 玩家1射擊 (F鍵)
  if (key === 'f' || key === 'F') {
    shoot(player1);
  }
  
  // 玩家2射擊 (空白鍵)
  if (keyCode === 32) {
    shoot(player2);
  }
  }
  
  // 射擊功能
  function shoot(player) {
  if (player.bullets.length < 3) {
    let playerWidth = sprites[player === player1 ? 'player1' : 'player2'].idle.width;
    
    let bullet = {
      x: player.x + (player.direction === 1 ? playerWidth : 0),
      y: player.y + playerWidth/2,
      speed: 10 * player.direction,
      isExploding: false,
      currentFrame: 0,
      explosionFrame: 0
    };
    
    player.bullets.push(bullet);
    player.currentAction = 'jump';
    
    setTimeout(() => {
      if (!player.isJumping && player.currentAction === 'jump') {
        player.currentAction = 'idle';
      }
    }, 500);
  }
  }
  
  // 繪製角色
  function drawCharacter(player, spriteData) {
  let currentSprite = spriteData[player.currentAction];
  
  push();
  translate(player.x + (player.direction === -1 ? currentSprite.width : 0), player.y);
  scale(player.direction, 1);
  
  image(
    currentSprite.img,
    0, 0,
    currentSprite.width*3,
    currentSprite.height*3,
    Math.floor(player.currentFrame) * currentSprite.width,
    0,
    currentSprite.width,
    currentSprite.height
  );
  
  pop();
  
  player.currentFrame = (player.currentFrame + 0.2) % currentSprite.frames;
  }
  function drawHealth() {
    // 設定文字樣式
    textSize(16);
    textA//lign(CENTER);
    
    // 玩家1和玩家2的生命值
    drawPlayerHealth(player1, sprites.player1);
    drawPlayerHealth(player2, sprites.player2);
}

// 繪製單個玩家的生命值
function drawPlayerHealth(player, spriteData) {
    // 計算生命值條的位置和大小
    let barWidth = 60;
    let barHeight = 8;
    let barY = player.y - spriteData.idle.height - 20;
    let barX = player.x + (spriteData.idle.width / 2) - (barWidth / 2);
    
    // 繪製生命值背景（灰色）
    noStroke();
    fill(100);
    rect(barX, barY, barWidth, barHeight);
    
    // 繪製生命值（紅色）
    fill(255, 0, 0);
    let healthWidth = (player.health / 100) * barWidth;
    rect(barX, barY, healthWidth, barHeight);
    
    // 繪製生命值數字
    fill(255);
    stroke(0);
    strokeWeight(2);
    text(player.health + '/100', 
         player.x + (spriteData.idle.width / 2), 
         barY + barHeight + 15);
    
    // 重設繪圖設定
    noStroke();
    strokeWeight(1);
}
  // 繪製子彈
  function drawBullets(player) {
  for (let i = player.bullets.length - 1; i >= 0; i--) {
    let bullet = player.bullets[i];
    
    if (!bullet.isExploding) {
      let sx = bullet.currentFrame * sprites.bullet.width;
      
      push();
      translate(bullet.x + (bullet.speed < 0 ? sprites.bullet.width : 0), bullet.y);
      scale(bullet.speed > 0 ? 1 : -1, 1);
      image(sprites.bullet.img, 
            0, 0,
            sprites.bullet.width, sprites.bullet.height,
            sx, 0,
            sprites.bullet.width, sprites.bullet.height);
      pop();
      
      bullet.x += bullet.speed;
      bullet.currentFrame = (bullet.currentFrame + 1) % sprites.bullet.frames;
      
      if (bullet.x < 0 || bullet.x > width) {
        player.bullets.splice(i, 1);
      }
    } else {
      if (!bullet.explosionStartTime) {
        bullet.explosionStartTime = frameCount;
      }
      
      let currentTime = frameCount - bullet.explosionStartTime;
      
      if (currentTime < 1) {
        let explosionSprite = sprites.explosion;
        image(explosionSprite.img, 
              bullet.x - explosionSprite.width/2, 
              bullet.y - explosionSprite.height/2, 
              explosionSprite.width, explosionSprite.height,
              bullet.explosionFrame * explosionSprite.width, 0,
              explosionSprite.width, explosionSprite.height);
        
        bullet.explosionFrame = explosionSprite.frames - 1;
      } else {
        player.bullets.splice(i, 1);
      }
    }
  }
  }
  
  // 檢查碰撞
  function checkCollisions() {
  // 檢查玩家1的子彈
  for (let i = player1.bullets.length - 1; i >= 0; i--) {
    let bullet = player1.bullets[i];
    if (checkBulletHit(bullet, player2)) {
      bullet.isExploding = true;
      bullet.explosionFrame = 0;
      player2.health -= 10;
    }
  }
  
  // 檢查玩家2的子彈
  for (let i = player2.bullets.length - 1; i >= 0; i--) {
    let bullet = player2.bullets[i];
    if (checkBulletHit(bullet, player1)) {
      bullet.isExploding = true;
      bullet.explosionFrame = 0;
      player1.health -= 10;
    }
  }
  }
  
  // 檢查子彈命中
  function checkBulletHit(bullet, player) {
  return bullet.x > player.x && 
         bullet.x < player.x + sprites[player === player1 ? 'player1' : 'player2'].idle.width &&
         bullet.y > player.y &&
         bullet.y < player.y + sprites[player === player1 ? 'player1' : 'player2'].idle.height;
  }
  
  // 繪製生命值
  function drawHealth() {
  // 玩家1生命值
  fill(255, 0, 0);
  rect(10, 10, player1.health, 20);
  
  // 玩家2生命值
  push();
  translate(width - 10, 10);
  rect(-player2.health, 0, player2.health, 20);
  pop();
  } 