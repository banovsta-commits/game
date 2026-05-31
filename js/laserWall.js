export class LaserWall {
    // Method: constructor — initialize laser wall ability state
    constructor() {
        this.cooldown = 10000;     
        this.duration = 6000;   
        this.damage = 40;        
        this.tickRate = 500;    
        this.lastStateChange = 0;   
        this.exists = false;
        this.beams = [];
    }

    // Method: update — manage laser wall activation, collision, and damage
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
                this.beams = [];

                const thickness = 30 * sizeMultiplier; 
                const offset = 80 * sizeMultiplier;
                const length = 6000;
                
                const cx = player.x + player.size / 2;
                const cy = player.y + player.size / 2;

                this.beams.push({ x: cx - length/2, y: cy - offset - thickness, w: length, h: thickness }); // Horní
                this.beams.push({ x: cx - length/2, y: cy + offset, w: length, h: thickness });             // Spodní
                this.beams.push({ x: cx - offset - thickness, y: cy - length/2, w: thickness, h: length }); // Levá
                this.beams.push({ x: cx + offset, y: cy - length/2, w: thickness, h: length });             // Pravá
            }
        } else {
            enemies.forEach(enemy => {
                if (!enemy.exists) return;

                let isTouchingLaser = false;

                this.beams.forEach(beam => {
                    let overlapX = Math.min(enemy.x + enemy.size, beam.x + beam.w) - Math.max(enemy.x, beam.x);
                    let overlapY = Math.min(enemy.y + enemy.size, beam.y + beam.h) - Math.max(enemy.y, beam.y);

                    if (overlapX > 0 && overlapY > 0) {
                        isTouchingLaser = true;
           
                        if (overlapX < overlapY) {
                            if (enemy.x + enemy.size / 2 < beam.x + beam.w / 2) {
                                enemy.x -= overlapX;
                            } else {
                                enemy.x += overlapX;
                            }
                        } else {
                            if (enemy.y + enemy.size / 2 < beam.y + beam.h / 2) {
                                enemy.y -= overlapY;
                            } else {
                                enemy.y += overlapY;
                            }
                        }
                    }
                });

                if (isTouchingLaser) {
                    enemy.color = 'cyan';
      
                    if (currentTime - (enemy.laserBoxDamage || 0) > this.tickRate) {
                        enemy.HP -= this.damage * dmgMultiplier;
                        enemy.laserBoxDamage = currentTime;

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
                this.beams = [];
                this.lastStateChange = currentTime;
            }
        }
    }

    // Method: draw — render active laser wall beams
    draw(ctx) {
        if (!this.exists) return;
        ctx.fillStyle = '#00ffcc';
        this.beams.forEach(beam => {
            ctx.fillRect(beam.x, beam.y, beam.w, beam.h);
        });
    }
}