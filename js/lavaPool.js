export class LavaPool {
    // Method: constructor — initialize lava pool parameters and state
    constructor(x, y, size, color, AD, attackSpeed, lastAttack, exists, lastStateChange, cooldown, duration) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
        this.AD = AD;
        this.attackSpeed = attackSpeed;
        this.lastAttack = lastAttack;
        this.exists = exists;
        this.lastStateChange = lastStateChange;
        this.cooldown = cooldown;
        this.duration = duration;
        this.level = 1;
        this.activePools = [];
    }

    // Method: updateLavaPool — spawn pools and apply damage to enemies
    updateLavaPool(player, enemies, canvas) {
        const currentTime = Date.now();
        const cycle = currentTime - this.lastStateChange;

        if (!this.exists) {
            if (cycle > this.cooldown / player.abilityHaste) {
                this.exists = true;
                this.lastStateChange = currentTime;
                this.activePools = [];

                this.currentSize = (this.size + (this.level - 1) * 10) * player.abilityMultiplier;

                for (let i = 0; i < this.level; i++) {
                    let spawnX, spawnY;
                    
                    if (i === 0) {
                        spawnX = player.x + (player.size / 2) - (this.currentSize / 2);
                        spawnY = player.y + (player.size / 2) - (this.currentSize / 2);
                    } else {
                        let offsetX = (Math.random() * 800) - 400; 
                        let offsetY = (Math.random() * 800) - 400;
                        spawnX = player.x + offsetX;
                        spawnY = player.y + offsetY;
                    }

                    spawnX = Math.max(0, Math.min(spawnX, canvas.width - this.currentSize));
                    spawnY = Math.max(0, Math.min(spawnY, canvas.height - this.currentSize));
                    this.activePools.push({ 
                        x: spawnX,
                        y: spawnY
                    });
                }
            }
        } else {

            enemies.forEach(enemy => {
                if (!enemy.exists) return;

                let inAnyLava = false;
                for (let pool of this.activePools) {
                    if (pool.x < enemy.x + enemy.size &&
                        pool.x + this.currentSize > enemy.x &&
                        pool.y < enemy.y + enemy.size &&
                        pool.y + this.currentSize > enemy.y) {
                        inAnyLava = true;
                        break;
                    }
                }

                if (inAnyLava) {
                    enemy.color = 'darkred';
                    enemy.speed = enemy.baseSpeed / 2;

                    if (currentTime - (enemy.lavaPoolDamage || 0) > this.attackSpeed) {
                        enemy.HP -= this.AD * player.additionalDamage;  
                        enemy.lavaPoolDamage = currentTime;
                        console.log("Nepřítel se pálí! HP:", enemy.HP);

                        if (enemy.HP <= 0) {
                            enemy.exists = false;
                            player.MP += 20;
                            player.killCount += 1;

                            if (player.MP >= player.maxMp) {
                                player.MP = 0;
                                player.skillPoint += 1;
                                player.maxMp *= 1.2;
                                player.level += 1;
                            }
                        }
                    }
                }
            });

            if (cycle > this.duration) {
                this.exists = false;
                this.activePools = [];
                this.lastStateChange = currentTime;
            }
        }
    }
    // Method: draw — render active lava pools
    draw(ctx) {
        ctx.fillStyle = this.color;
        this.activePools.forEach(pool => {
            ctx.fillRect(pool.x, pool.y, this.currentSize, this.currentSize);
        });
    }
}