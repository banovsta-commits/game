export const player = { 
    x : 200, 
    y : 100,
    size : 30,
    color : 'blue',
    speed : 6,
    HP : 100,
    maxHp : 100,
    MP : 0,
    maxMp : 100,
    skillPoint : 1,
    skills : [],
    killCount : 0,
    level : 1,
    additionalDamage : 1.0,
    abilityMultiplier : 1.0,
    abilityHaste : 1.0
};

// Function: updatePlayer — handle player movement, bounds and collisions
export function updatePlayer(keys, WIDTH, HEIGHT, enemies) {
    if (keys['w']) {
        player.y -= player.speed;
    }
    if (keys['a']) {
        player.x -= player.speed;
    }
    if (keys['s']) {
        player.y += player.speed;
    }
    if (keys['d']) {
        player.x += player.speed;
    }

    if (player.x < 0) {
        player.x = 0;
    }
    if (player.y < 0) {
        player.y = 0;
    }
    if (player.x + player.size > WIDTH) {
        player.x = WIDTH - player.size;
    }
    if (player.y + player.size > HEIGHT) {
        player.y = HEIGHT - player.size;
    }
    enemies.forEach(enemy => {
        if (player.x < enemy.x + enemy.size && player.x + player.size > enemy.x && player.y < enemy.y + enemy.size && player.y + player.size > enemy.y) {
            const currentTime = Date.now();
            if (currentTime - enemy.lastAttack > enemy.attackSpeed && player.HP != 0) {
                player.HP -= enemy.AD;  
                enemy.lastAttack = currentTime;
            }
            if (player.HP <= 0) {
                player.HP = 0;
                document.getElementById('gameOver').style.display = 'block';
            }
        }
    });
}