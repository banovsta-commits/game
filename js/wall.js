export class Wall {
    // Method: constructor — initialize wall parameters and internal state
    constructor(width, height, color, cooldown, duration) {
        this.x = 0;
        this.y = 0;
        this.width = width;
        this.height = height;
        this.color = color;
        this.cooldown = cooldown;
        this.duration = duration;
        this.level = 1;
        this.walls = [];

        this.lastStateChange = Date.now();
    }

    // Method: updateWall — spawn and manage walls, handle collisions
    updateWall(player, enemies) {
        const currentTime = Date.now();
        const cycle = currentTime - this.lastStateChange;

        if (!this.exists) {
            if (cycle > this.cooldown) {
                this.exists = true;
                this.lastStateChange = currentTime;
                this.walls = [];

                const playerCenterX = player.x + player.size / 2;
                const playerCenterY = player.y + player.size / 2;
                const wide = Math.min(this.width, this.height);
                const long = Math.max(this.width, this.height) * player.abilityMultiplier;
                const offset = long / 2;

                if (this.level >= 1) {
                    this.walls.push({
                        x: playerCenterX - offset,
                        y: playerCenterY - offset,
                        width: wide,
                        height: long
                    });
                }
                if (this.level >= 2) {
                    this.walls.push({
                        x: playerCenterX - offset,
                        y: playerCenterY + offset - wide,
                        width: long,
                        height: wide
                    });
                }
                if (this.level >= 3) {
                    this.walls.push({
                        x: playerCenterX - offset,
                        y: playerCenterY - offset,
                        width: long,
                        height: wide
                    });
                     this.walls.push({
                        x: playerCenterX + offset - wide,
                        y: playerCenterY - offset,
                        width: wide,
                        height: long
                    });
                }
            }
        } else {
            enemies.forEach(enemy => {
                if (!enemy.exists) return;

                this.walls.forEach(wall => {
                    let overlapX = Math.min(enemy.x + enemy.size, wall.x + wall.width) - Math.max(enemy.x, wall.x);
                    let overlapY = Math.min(enemy.y + enemy.size, wall.y + wall.height) - Math.max(enemy.y, wall.y);

                    if (overlapX > 0 && overlapY > 0) {
                        if (overlapX < overlapY) {
                            if (enemy.x + enemy.size / 2 < wall.x + wall.width / 2) {
                                enemy.x -= overlapX;
                            } else {
                                enemy.x += overlapX;
                            }
                        } else {
                            if (enemy.y + enemy.size / 2 < wall.y + wall.height / 2) {
                                enemy.y -= overlapY;
                            } else {
                                enemy.y += overlapY;
                            }
                        }
                    }
                });
            });

            if (cycle > this.duration / player.abilityHaste) {
                this.exists = false;
                this.lastStateChange = currentTime;
                this.walls = [];
            }
        }
    }

    // Method: draw — render active walls
    draw(ctx) {
        if (!this.exists) return;
        ctx.fillStyle = this.color;
            this.walls.forEach(wall => {
                ctx.fillRect(wall.x, wall.y, wall.width, wall.height);
            });
    }
}