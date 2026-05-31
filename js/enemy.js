export class Enemy {
    constructor(x, y, size, color, baseSpeed, speed, HP, AD, attackSpeed, lastAttack, exists) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
        this.baseSpeed = baseSpeed;
        this.speed = speed;
        this.HP = HP;
        this.AD = AD;
        this.attackSpeed = attackSpeed;
        this.lastAttack = lastAttack;
        this.exists = exists;
    }

    resolveEnemyCollisions(enemies) {
        enemies.forEach(other => {
            if (this === other) return;

            if (this.x < other.x + other.size &&
                this.x + this.size > other.x &&
                this.y < other.y + other.size &&
                this.y + this.size > other.y) {
    
                const diffX = this.x - other.x;
                const diffY = this.y - other.y;

                if (diffX === 0 && diffY === 0) {
                    this.x += Math.random() - 0.5;
                    this.y += Math.random() - 0.5;
                } else {
                    this.x += diffX > 0 ? 1 : -1;
                    this.y += diffY > 0 ? 1 : -1;
                }
            }
        });
    }

    updateEnemy(player) {
        if (!this.exists) return;

        if (this.x < player.x) {
            this.x += this.speed;
        }
        if (this.x > player.x) {
            this.x -= this.speed;
        }
        if (this.y < player.y) {
            this.y += this.speed;
        }
        if (this.y > player.y) {
            this.y -= this.speed;
        }        

        this.speed = this.baseSpeed;
        this.color = 'red'
    }
}
