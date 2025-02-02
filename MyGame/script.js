const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let character = new Image();
let bg = new Image();
let enemy = new Image();
//Переменные и объекты
let isJumping = false;
let jumpVelocity = 0;
let gravity = 0.5;
const spriteChangeInterval = 3; 
let frameCount = 0; 
let enemySpawnInterval = 3000; 


bg.src = "img/bg1.png";

let index = 0;
    

const sprites = [];
for (let i = 0; i < 8; i++) {
    const image = new Image();
    image.src = `sprites/hero_run${i}.png`; 
    sprites.push(image);
}

const enemyes = [];
for (let i = 0; i < 8; i++) {
    const enemyImg = new Image();
    enemyImg.src = `enemy/enemy${i}.png`; 
    enemyes.push(enemyImg);
}

let score = 0;
let xPos_hero = 67;
let yPos_hero = 277;
let bgX1 = 0; 
let bgX2 = canvas.width; 

const MovingEnemyes = [];
let enemySpawnIntervalMin = 3000; 
let  enemySpawnIntervalMax = 5000; 
let enemySpeed = 7; 
let gameStarted = false; 
let successfulJumps = 0; 





function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    bgX1 -= 3; 
    bgX2 -= 3;
    if (bgX1 <= -canvas.width) {
        bgX1 = canvas.width;
    }
    if (bgX2 <= -canvas.width) {
        bgX2 = canvas.width;
    }

   
    ctx.drawImage(bg, bgX1, 0);
    ctx.drawImage(bg, bgX2, 0);

    if (isJumping) {
        yPos_hero += jumpVelocity;
        jumpVelocity += gravity;

    
        if (yPos_hero >= 277) { 
            yPos_hero = 277; 
            isJumping = false; 
            jumpVelocity = 0; 
        }
    }

    if (frameCount % spriteChangeInterval === 0) {
        index++; 
    }

    ctx.drawImage(sprites[index % sprites.length], xPos_hero, yPos_hero);

    for (let i = MovingEnemyes.length - 1; i >= 0; i--) {
        const enemyX = MovingEnemyes[i].x;
        ctx.drawImage(enemyes[index % enemyes.length], enemyX, MovingEnemyes[i].y);
        MovingEnemyes[i].x -= enemySpeed; 

        
        if (Collision(xPos_hero, yPos_hero, MovingEnemyes[i])) {
            gameOver(); 
            resetGame(); 
            return;
        }

        
        if (MovingEnemyes[i].x < -50) { 
            MovingEnemyes.splice(i, 1);
            successfulJumps++; 
        }
    }

    frameCount++;

    
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText(`Рекорд: ${successfulJumps}`, 10, 20);
    document.getElementById('scoreDisplay').innerText = `Рекорд: ${successfulJumps}`;

    window.requestAnimationFrame(draw);
}
setInterval(enemySpeed += 1, 1000); 






function Collision(heroX, heroY, enemy) {
    const heroWidth = sprites[index % sprites.length].width;
    const heroHeight = sprites[index % sprites.length].height;

    const enemyWidth = enemyes[index % enemyes.length].width;
    const enemyHeight = enemyes[index % enemyes.length].height;

    return (
        heroX < enemy.x + enemyWidth &&
        heroX + heroWidth > enemy.x &&
        heroY < enemy.y + enemyHeight &&
        heroY + heroHeight > enemy.y
    );
}






function spawnEnemy() {
    const enemyX = canvas.width; 
    MovingEnemyes.push({ x: enemyX, y: 290 }); 

    const spawnInterval = Math.floor(Math.random() * (enemySpawnIntervalMax - enemySpawnIntervalMin + 1)) + enemySpawnIntervalMin;
    setTimeout(spawnEnemy, spawnInterval);
}

window.addEventListener('keydown', (event) => {
    if (event.code === 'Space' && !isJumping) { 
        isJumping = true;
        jumpVelocity = -13;
    }
});





function resetGame() {
    MovingEnemyes.length = 0; 
    score = 0; 
    successfulJumps = 0; 
    gameStarted = false; 
    enemySpeed = 7
    enemySpawnInterval = 3000; 
    enemySpawnIntervalMin = 3000; 
    enemySpawnIntervalMax = 5000; 

}



document.getElementById('startButton').addEventListener('click', () => {
    if (!gameStarted) {
gameStarted = true;
draw(); 
spawnEnemy(); 


setInterval(() => {
    if (enemySpeed < 20) { 
        enemySpeed += 1;
    }
}, 60000); 
}
});

function gameOver() {
    const overImage = new Image();
    overImage.src = `Over/GameOver.png`; 
    
   
    overImage.onload = function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height); 
        ctx.drawImage(overImage, 0, 0); 
       
    };
}
