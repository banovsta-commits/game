export class CircleOfFire {
    // Method: constructor — initialize circle of fire ability state
    constructor() {
        this.cooldown = 8000;     
        this.duration = 4000;    
        this.damage = 35;        
        this.attackSpeed = 500;  
        this.lastStateChange = 0;
        this.exists = false;
        this.activePools = [];
        this.currentSize = 150;
    }

    // Method: update — manage activation, damage, and expiration of the fire circle
    update(player, enemies) {
        const currentTime = Date.now();
        const cycle = currentTime - this.lastStateChange;
    
        const haste = player.abilityHaste || 1.0;
        const sizeMultiplier = player.abilityMultiplier || 1.0;
        const dmgMultiplier = player.additionalDamage || 1.0;

        if (!this.exists) {
            if (cycle > this.cooldown / haste) {
                this.exists = true;
                this.lastStateChange = currentTime;
                this.activePools = [];

                const numPools = 12;
                const radius = 250 * sizeMultiplier; 
                this.currentSize = 150 * sizeMultiplier; 

                for (let i = 0; i < numPools; i++) {
                    const angle = (i / numPools) * Math.PI * 2;
                    const px = player.x + player.size / 2 + Math.cos(angle) * radius - this.currentSize / 2;
                    const py = player.y + player.size / 2 + Math.sin(angle) * radius - this.currentSize / 2;

                    this.activePools.push({ x: px, y: py });
                }
            }
        } else {
            enemies.forEach(enemy => {
                if (!enemy.exists) return;

                let inFire = false;
                for (let pool of this.activePools) {
                    if (pool.x < enemy.x + enemy.size &&
                        pool.x + this.currentSize > enemy.x &&
                        pool.y < enemy.y + enemy.size &&
                        pool.y + this.currentSize > enemy.y) {
                        inFire = true;
                        break;
                    }
                }

                if (inFire) {
                    enemy.color = 'darkred'; 
                    enemy.speed = enemy.baseSpeed / 2; 

                    if (currentTime - (enemy.circleFireDamage || 0) > this.attackSpeed) {
                        enemy.HP -= this.damage * dmgMultiplier;
                        enemy.circleFireDamage = currentTime;

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

    // Method: draw — render the active fire pools around the player
    draw(ctx) {
        if (!this.exists) return;
        ctx.fillStyle = 'orange';
        this.activePools.forEach(pool => {
            ctx.fillRect(pool.x, pool.y, this.currentSize, this.currentSize);
        });
    }
}