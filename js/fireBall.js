import { Ball } from "./Ball.js";

export class FireBall{
    // Method: constructor — initialize fireball state and cooldown
    constructor() {
        this.projectiles = [];
        this.cooldown = 2000;
        this.lastCast = Date.now() - this.cooldown;
        this.level = 1;
    }

    // Method: cast — spawn projectiles based on level and player state
    cast(player) {
        const now = Date.now();
        if (now - this.lastCast < this.cooldown / player.abilityHaste) return;

        const x = player.x + player.size / 2;
        const y = player.y + player.size / 2;
        const currentSize = 20 * player.abilityMultiplier;

        if (this.level === 1) {
            this.projectiles.push(new Ball(x, y, 1, 0, currentSize));
            this.projectiles.push(new Ball(x, y, -1, 0, currentSize));
            this.projectiles.push(new Ball(x, y, 0, 1, currentSize));  
            this.projectiles.push(new Ball(x, y, 0, -1, currentSize)); 
        } else if (this.level === 2) {
            this.projectiles.push(new Ball(x, y, 1, 0, currentSize));
            this.projectiles.push(new Ball(x, y, -1, 0, currentSize));
            this.projectiles.push(new Ball(x, y, 0, 1, currentSize));  
            this.projectiles.push(new Ball(x, y, 0, -1, currentSize));

            const diagNorm = 1 / Math.sqrt(2);
            this.projectiles.push(new Ball(x, y, diagNorm, diagNorm, currentSize));
            this.projectiles.push(new Ball(x, y, -diagNorm, diagNorm, currentSize));
            this.projectiles.push(new Ball(x, y, diagNorm, -diagNorm, currentSize));
            this.projectiles.push(new Ball(x, y, -diagNorm, -diagNorm, currentSize));
        } else if (this.level >= 3) {
            for (let i = 0; i < 12; i++) {
                const angle = (i / 12) * Math.PI * 2;
                const dirX = Math.cos(angle);
                const dirY = Math.sin(angle);
                this.projectiles.push(new Ball(x, y, dirX, dirY, currentSize));
            }
        }

        this.lastCast = now;
    }

    // Method: update — move projectiles and handle enemy collisions
    update(enemies, player) {

        this.projectiles.forEach(p => p.update());

        this.projectiles.forEach(p => {
            enemies.forEach(enemy => {
                if (!p.exists || !enemy.exists) return;

                const hit =
                    p.x < enemy.x + enemy.size &&
                    p.x + p.size > enemy.x &&
                    p.y < enemy.y + enemy.size &&
                    p.y + p.size > enemy.y;

                if (hit) {
                    enemy.HP -= p.damage * player.additionalDamage;
                    p.exists = false;

                    if (enemy.HP <= 0) {
                        enemy.exists = false;
                        player.MP += 200;
                        player.killCount += 1;

                        if (player.MP >= player.maxMp) {
                            player.MP = 0;
                            player.skillPoint += 1;
                            player.maxMp *= 1.2;
                            player.level += 1;
                        }
                    }
                }
            });
        });

        this.projectiles = this.projectiles.filter(p => p.exists);
    }

    // Method: draw — render active projectiles
    draw(ctx) {
        this.projectiles.forEach(p => p.draw(ctx));
    }
}