import { player, updatePlayer } from './player.js';
import { Enemy } from './enemy.js';
import { LavaPool } from './lavaPool.js';
import { drawSkillsChoice, handleSkillsClick } from './skills.js';
import { FireBall } from './fireBall.js';
import { Laser } from './laser.js';
import { Wall } from './wall.js';
import { Poison } from './poison.js';
import { CircleOfFire } from './circleOfFire.js';
import { LaserWall } from './laserWall.js';

window.addEventListener('offline', () => {
    alert('You are now offline. Please check your internet connection.');
});
window.addEventListener('online', () => {
    console.log('Připojení k internetu bylo obnoveno.');
});

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const backgroundMusic = new Audio('backmusic.mp3');
backgroundMusic.loop = true;
backgroundMusic.volume = 0.1;

const keys = {};

const WIDTH = 2400;
const HEIGHT = 1800;
let viewX = 0;
let viewY = 0;

let startTime = Date.now();
let enemies = [];
let lastSpawnTime = Date.now();
const spawnInterval = 2500;
let lavaPool = null;
let laser = null;
let wall = null;
let fireBall = null;
let poison = null;
let circleOfFire = null;
let laserWall = null;

window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        window.location.href = 'menu.html'; 
        return; 
    }
    keys[e.key.toLowerCase()] = true;
});
window.addEventListener('keyup', (e) => keys[e.key.toLowerCase()] = false);

canvas.addEventListener('mousedown', (e) => {
    if (backgroundMusic.paused) {
        backgroundMusic.play().catch(err => console.log("Audio se nepodařilo spustit:", err));
    }

    if (player.skillPoint > 0) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        handleSkillsClick(mouseX, mouseY, player, lavaPool, laser, fireBall, wall);
    }
});

// Function: applySkills — initialize or upgrade player's unlocked skills
function applySkills() {
    player.skills.forEach(skill => {
        switch (skill) {
            case 'lavaPool':
                if (!lavaPool) {
                    lavaPool = new LavaPool(0, 0, 150, 'orange', 15, 500, 0, false, Date.now(), 5000, 3000);
                }
                break;
            case 'fireBall':
                if (!fireBall) {
                    fireBall = new FireBall();
                }
                break;
            case 'laser':
                if (!laser) {
                    laser = new Laser(0, 0, 10, 'lightblue', 25, 200, 0, false, Date.now(), 5000, 3000, 0, 0.015, 1000);
                }
                break;
            case 'wall':
                if (!wall) {
                    wall = new Wall(30, 120, '#7f8c8d', 7000, 4000); 
                }
                break;
            case 'poison':
                if (!poison) {
                    poison = new Poison();
                }
                break;
            case 'circleOfFire':
                if (!circleOfFire) {
                    circleOfFire = new CircleOfFire();
                }
                break; 
            case 'laserWall':
                if (!laserWall) {
                    laserWall = new LaserWall();
                }
                break;      
        }
    });
}

// Function: drawPlayer — render the player rectangle on the canvas
function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.size, player.size);
}

// Function: drawEnemies — render all enemies on the canvas
function drawEnemies() {
    enemies.forEach(en => {
        ctx.fillStyle = en.color;
        ctx.fillRect(en.x, en.y, en.size, en.size);
    });
}

// Function: drawAbilities — draw active ability effects and objects
function drawAbilities() {
    if (lavaPool && player.skills.includes('lavaPool')) {
        lavaPool.draw(ctx);
    }

    if (fireBall && player.skills.includes('fireBall')) {
        fireBall.draw(ctx);
    }

    if (laser && player.skills.includes('laser')) {
        laser.draw(ctx);
    }

    if (wall && player.skills.includes('wall')) {
        wall.draw(ctx);
    }
    if (poison && player.skills.includes('poison')) {
        poison.draw(ctx);
    }
    if (circleOfFire && player.skills.includes('circleOfFire')) {
        circleOfFire.draw(ctx);
    }
    if (laserWall && player.skills.includes('laserWall')) {
        laserWall.draw(ctx);
    }
}

// Function: drawHUD — draw player HUD (HP/MP bars)
function drawHUD() {
    const hudX = 20; 
    const hudY = 20;
    const hudWidth = 200; 
    const hudHeight = 25; 

    ctx.fillStyle = 'rgba(50, 50, 50, 0.8)';
    ctx.fillRect(hudX, hudY, hudWidth, hudHeight);

    const hpPercent = player.HP / player.maxHp;
    const currentBarWidth = hudWidth * hpPercent;

    ctx.fillStyle = player.HP > 30 ? '#2ecc71' : '#e74c3c';
    ctx.fillRect(hudX, hudY, currentBarWidth, hudHeight);

    ctx.fillStyle = 'rgba(50, 50, 50, 0.8)';
    ctx.fillRect(hudX, hudY + hudHeight + 5, hudWidth, hudHeight);

    const mpProcent = player.MP / player.maxMp;
    const currentMpBarWidth = hudWidth * mpProcent;

    ctx.fillStyle = '#3498db';
    ctx.fillRect(hudX, hudY + hudHeight + 5, currentMpBarWidth, hudHeight);
}

// Function: draw — clear canvas and redraw the entire scene
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    viewX = player.x + player.size / 2 - canvas.width / 2;
    viewY = player.y + player.size / 2 - canvas.height / 2;
    viewX = Math.max(0, Math.min(viewX, WIDTH - canvas.width));
    viewY = Math.max(0, Math.min(viewY, HEIGHT - canvas.height));

    ctx.save();
    ctx.translate(-viewX, -viewY);

    ctx.strokeStyle = '#ab0000';
    ctx.lineWidth = 10;
    ctx.strokeRect(0, 0, WIDTH, HEIGHT);

    ctx.strokeStyle = '#302d2d'; 
    ctx.lineWidth = 2;       
    const gridSize = 100;
    ctx.beginPath();
    for (let x = 0; x <= WIDTH; x += gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, HEIGHT);
    }
    for (let y = 0; y <= HEIGHT; y += gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(WIDTH, y);
    }
    ctx.stroke();

    drawAbilities();
    drawPlayer();
    drawEnemies();

    ctx.restore();

    drawHUD();
}

// Function: gameLoop — main game loop (update, draw, spawn)
function gameLoop() {
    const currentTime = Date.now();

    if (player.HP <= 0) {
        player.HP = 0;
        document.getElementById('gameOver').style.display = 'block';
        if (!player.scoreSaved) {
            const timeInGame = Math.floor((Date.now() - startTime) / 1000);

            const scoreData = {
                level: player.level,
                time: timeInGame,
                killCount: player.killCount,
                skills: player.skills.length > 0 ? player.skills.join(', ') : 'Žádné'
            };

            let history = JSON.parse(localStorage.getItem('scoreHistory')) || [];
            history.push(scoreData);
            localStorage.setItem('scoreHistory', JSON.stringify(history));
            player.scoreSaved = true;
        }
        return;
    }

    if (player.skillPoint != 0) {
        draw();
        drawSkillsChoice(ctx, canvas, player, lavaPool, laser, fireBall, wall);
        requestAnimationFrame(gameLoop);
        return; 
    }

    if (currentTime - lastSpawnTime > spawnInterval) {
        const randomX = Math.random() * WIDTH - 50;
        const randomY = Math.random() > 0.5 ? 0 : HEIGHT; 
        const timeSurvived = Math.floor((currentTime - startTime) / 60000);
        
        let statMultiplier = 1.0;
        let sizeMultiplier = 1.0;

        for (let i = 1; i <= timeSurvived; i++) {
            if (i % 3 === 0) {
                statMultiplier *= 1.20;
                sizeMultiplier *= 1.20;
            } else {
                statMultiplier *= 1.10;
            }
        }

        const enemyColors = ['red', 'yellow', 'purple', 'fuchsia', 'darkred']
        const colorTier = Math.floor(timeSurvived / 3);
        const finalColor = enemyColors[colorTier % enemyColors.length];

        const baseSize = 50;
        const baseSpeedVal = 1;
        const baseHp = 100;
        const baseAd = 5;

        const finalSize = baseSize * sizeMultiplier;
        const finalSpeed = baseSpeedVal * statMultiplier;
        const finalHp = baseHp * statMultiplier;
        const finalAd = baseAd * statMultiplier;

        enemies.push(new Enemy(randomX, randomY, finalSize, finalColor, finalSpeed, finalSpeed, finalHp, finalAd, 1000, 0, true));
        
        lastSpawnTime = currentTime;
        console.log("Nový nepřítel na scéně! Počet:", enemies.length);
    }

    updatePlayer(keys, WIDTH, HEIGHT, enemies);
    enemies.forEach(enemy => {
        enemy.updateEnemy(player);
        enemy.resolveEnemyCollisions(enemies); 
    });
    enemies = enemies.filter(enemy => enemy.exists);

    applySkills();
    if (lavaPool && player.skills.includes('lavaPool')) {
        lavaPool.updateLavaPool(player, enemies, {width: WIDTH, height: HEIGHT});
    }

    if (fireBall && player.skills.includes('fireBall')) {
        fireBall.cast(player);
        fireBall.update(enemies, player);
    }

    if (laser && player.skills.includes('laser')) {
        laser.updateLaser(player, enemies);
    }
    
    if (wall && player.skills.includes('wall')) {
        wall.updateWall(player, enemies);
    }

    if (poison && player.skills.includes('poison')) {
        poison.update(player, enemies);
    }

    if (circleOfFire && player.skills.includes('circleOfFire')) {
        circleOfFire.update(player, enemies);
    }
    if (laserWall && player.skills.includes('laserWall')) {
        laserWall.update(player, enemies);
    }   

    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();

