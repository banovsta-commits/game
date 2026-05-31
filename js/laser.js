export class Laser {
    // Method: constructor — initialize laser parameters and state
    constructor(x, y, size, color, AD, attackSpeed, lastAttack, exists, lastStateChange, cooldown, duration, angle, rotationSpeed, range) {
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
        this.angle = angle;
        this.rotationSpeed = rotationSpeed;
        this.range = range;
          this.level = 1;
          this.activeBeams = [];
    }

    // Method: updateLaser — update laser activation, rotation and damage
    updateLaser(player, enemies) {
        const currentTime = Date.now();
        const cycle = currentTime - this.lastStateChange;

        if (!this.exists) {
            if (cycle > this.cooldown / player.abilityHaste) {
                this.exists = true;
                this.lastStateChange = currentTime;

                if (this.level === 1) {
                    this.activeBeams = [{ offset: 0 }];
                } else if (this.level === 2) {
                    const angleBetweenBeams = (2 * Math.PI) / 3;
                    this.activeBeams = [
                        { offset: 0 },
                        { offset: angleBetweenBeams },
                        { offset: -angleBetweenBeams }
                    ];
                } else if (this.level === 3) {
                    const angleBetweenBeams = (2 * Math.PI) / 5;
                    this.activeBeams = [
                        { offset: 0},
                        { offset: angleBetweenBeams },
                        { offset: -angleBetweenBeams },
                        { offset: angleBetweenBeams * 2 },
                        { offset: -angleBetweenBeams * 2 }
                    ];
                }
                
            }
        } else {
            this.x = player.x + player.size / 2;
            this.y = player.y + player.size / 2;
    
            this.angle += this.rotationSpeed;

            this.angle = this.angle % (Math.PI * 2);

            this.currentRange = this.range * player.abilityMultiplier;
            this.currentSize = this.size * player.abilityMultiplier;
            const beamWidth = 0.15 * player.abilityMultiplier;

            enemies.forEach(enemy => {
                const enemyCenterX = enemy.x + enemy.size / 2;
                const enemyCenterY = enemy.y + enemy.size / 2;

                const dist = Math.hypot(enemyCenterX - this.x, enemyCenterY - this.y);

                if (dist <= this.currentRange) {
                    for (let beam of this.activeBeams) {
                        let beamAngle = this.angle + beam.offset;

                        if (beamAngle < 0) beamAngle += Math.PI * 2;
                        beamAngle = beamAngle % (Math.PI * 2);

                        let enemyAngle = Math.atan2(enemyCenterY - this.y, enemyCenterX - this.x);
                        if (enemyAngle < 0) enemyAngle += Math.PI * 2;

                        let angleDiff = Math.abs(beamAngle - enemyAngle);
                        if (angleDiff > Math.PI) {
                            angleDiff = Math.PI * 2 - angleDiff;
                        }

                        if (angleDiff < beamWidth) {
                            if (currentTime - (enemy.lastLaserDamage || 0) > this.attackSpeed) {
                                enemy.HP -= this.AD * player.additionalDamage;
                                enemy.lastLaserDamage = currentTime;

                                console.log(`Laser usmažil nepřítele! Zbývá mu HP: ${enemy.HP}`);

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
                            break;
                        }
                    }
                }
            });
            
            if (cycle > this.duration) {
                this.exists = false;
                this.lastStateChange = currentTime;
            }
        }
    }

    // Method: draw — render active laser beams
    draw(ctx) {
        if (!this.exists) return;

        for (let beam of this.activeBeams) {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle + beam.offset);

            ctx.fillStyle = this.color;
            ctx.fillRect(0, -this.currentSize / 2, this.currentRange, this.currentSize);

            ctx.restore();
        }
    }
}