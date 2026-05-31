export class Poison {
    // Method: constructor — initialize poison patches and timing
    constructor() {
        this.patches = [];
        this.dropRate = 100;      
        this.lastDrop = Date.now();
        this.patchDuration = 3000;  
        this.damage = 5;
        this.tickRate = 500; 
    }

    // Method: update — drop poison patches and damage enemies inside
    update(player, enemies) {
        const now = Date.now();

        if (now - this.lastDrop >= this.dropRate / player.abilityHaste) {
            this.patches.push({
                x: player.x,
                y: player.y,
                size: 3 * player.size * player.abilityMultiplier,
                createdAt: now
            });
            this.lastDrop = now;
        }

        this.patches = this.patches.filter(p => now - p.createdAt < this.patchDuration);

        enemies.forEach(enemy => {
            if (!enemy.exists) return;

            let inPoison = false;
            for (let patch of this.patches) {
                if (patch.x < enemy.x + enemy.size &&
                    patch.x + patch.size > enemy.x &&
                    patch.y < enemy.y + enemy.size &&
                    patch.y + patch.size > enemy.y) {
                    inPoison = true;
                    break;
                }
            }

            if (inPoison) {
                enemy.color = 'green'; 

                if (now - (enemy.lastPoisonDamage || 0) > this.tickRate) {
                    enemy.HP -= this.damage * player.additionalDamage;
                    enemy.lastPoisonDamage = now;
                    console.log(`Nepřítel se dusí v jedu! HP: ${enemy.HP}`);

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
    }

    // Method: draw — render poison patches with fading opacity
    draw(ctx) {
        const now = Date.now();
        
        this.patches.forEach(patch => {
            const age = now - patch.createdAt;
            const lifeRatio = Math.max(0, 1 - (age / this.patchDuration));
        
            ctx.fillStyle = `rgba(46, 204, 113, ${lifeRatio * 0.8})`; 
            ctx.fillRect(patch.x, patch.y, patch.size, patch.size);
        });
    }
}