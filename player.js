// ============================================================
// SWORDCERY - Player Character
// Movement, physics, animation, health/stamina
// ============================================================
 
class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.w = 24;
        this.h = 40;
        this.vx = 0;
        this.vy = 0;
        this.speed = 3.5;
        this.sprintSpeed = 5.5;
        this.jumpForce = -22;
        this.facing = 1; // 1=right, -1=left
        this.onGround = false;
        this.canDoubleJump = true;
        this.hasDoubleJumped = false;
        this.jumpPressed = false;
 
        // Stats
        this.maxHealth = 100;
        this.health = 100;
        this.maxStamina = 100;
        this.stamina = 100;
        this.staminaRegen = 0.3;
        this.staminaDrainSprint = 0.5;
        this.staminaDrainAttack = 20;
 
        // Combat
        this.weapon = 'sword'; // 'sword' or 'bow'
        this.attackCooldown = 0;
        this.swordCooldown = 25;
        this.bowCooldown = 35;
        this.isAttacking = false;
        this.attackFrame = 0;
        this.attackDuration = 15;
        this.invincible = 0;
        this.knockbackX = 0;
        this.knockbackY = 0;
 
        // Animation
        this.animFrame = 0;
        this.animTimer = 0;
        this.walkCycle = 0;
        this.alive = true;
        this.deathTimer = 0;
 
        // Arrows in flight
        this.arrows = [];
    }
 
    update(platforms, camera) {
        if (!this.alive) {
            this.deathTimer++;
            return;
        }
 
        const sprinting = Input.keys['shift'] && this.stamina > 0;
        const moveSpeed = sprinting ? this.sprintSpeed : this.speed;
 
        // Movement
        if (Input.keys['a'] || Input.keys['arrowleft']) {
            this.vx -= moveSpeed * 0.3;
            this.facing = -1;
        }
        if (Input.keys['d'] || Input.keys['arrowright']) {
            this.vx += moveSpeed * 0.3;
            this.facing = 1;
        }
 
        // Sprint stamina drain
        if (sprinting && (Input.keys['a'] || Input.keys['d'] || Input.keys['arrowleft'] || Input.keys['arrowright'])) {
            this.stamina -= this.staminaDrainSprint;
        }
 
        // Jump
        if (Input.keys['space'] || Input.keys['w'] || Input.keys['arrowup']) {
            if (!this.jumpPressed) {
                if (this.onGround) {
                    this.vy = this.jumpForce;
                    this.jumpPressed = true;
                    this.hasDoubleJumped = false;
                } else if (this.canDoubleJump && !this.hasDoubleJumped) {
                    this.vy = this.jumpForce * 0.85;
                    this.hasDoubleJumped = true;
                    this.jumpPressed = true;
                }
            }
        } else {
            this.jumpPressed = false;
        }
 
        // Weapon switching with 'e' or 'q'
        if (Input.keys['q'] || Input.keys['e']) {
            if (!this._switchPressed) {
                this.weapon = this.weapon === 'sword' ? 'bow' : 'sword';
                this._switchPressed = true;
            }
        } else {
            this._switchPressed = false;
        }
 
        // Also allow number keys
        if (Input.keys['1']) this.weapon = 'sword';
        if (Input.keys['2']) this.weapon = 'bow';
 
        // Attack
        if (this.attackCooldown > 0) this.attackCooldown--;
        if (Input.mouse.clicked && this.attackCooldown <= 0 && this.stamina >= this.staminaDrainAttack) {
            this.attack(camera);
        }
        if (this.isAttacking) {
            this.attackFrame++;
            if (this.attackFrame >= this.attackDuration) {
                this.isAttacking = false;
                this.attackFrame = 0;
            }
        }
 
        // Physics
        this.vx *= FRICTION;
        this.vx += this.knockbackX;
        this.vy += this.knockbackY;
        this.knockbackX *= 0.8;
        this.knockbackY *= 0.8;
        this.vy += GRAVITY;
        if (this.vy > MAX_FALL_SPEED) this.vy = MAX_FALL_SPEED;
 
        this.x += this.vx;
        this.y += this.vy;
 
        // Collision
        this.onGround = resolveCollision(this, platforms);
        if (this.onGround) {
            this.hasDoubleJumped = false;
        }
 
        // Stamina regen
        if (this.stamina < this.maxStamina) {
            this.stamina += this.staminaRegen;
            if (this.stamina > this.maxStamina) this.stamina = this.maxStamina;
        }
 
        // Invincibility frames
        if (this.invincible > 0) this.invincible--;
 
        // Walk animation
        if (Math.abs(this.vx) > 0.5) {
            this.walkCycle += 0.15;
        } else {
            this.walkCycle = 0;
        }
 
        // Update arrows
        for (let i = this.arrows.length - 1; i >= 0; i--) {
            const a = this.arrows[i];
            a.x += a.vx;
            a.y += a.vy;
            a.vy += 0.15;
            a.life--;
            if (a.life <= 0) this.arrows.splice(i, 1);
        }
 
        // Fall death
        if (this.y > 2000) {
            this.takeDamage(999);
        }
    }
 
    attack(camera) {
        this.isAttacking = true;
        this.attackFrame = 0;
        this.stamina -= this.staminaDrainAttack;
        if (this.stamina < 0) this.stamina = 0;
 
        if (this.weapon === 'sword') {
            this.attackCooldown = this.swordCooldown;
        } else {
            this.attackCooldown = this.bowCooldown;
            // Shoot arrow toward mouse
            const cx = this.x + this.w / 2;
            const cy = this.y + this.h / 2;
            const mx = Input.mouse.x - camera.getOffX();
            const my = Input.mouse.y - camera.getOffY();
            const angle = angleTo(cx, cy, mx, my);
            this.arrows.push({
                x: cx,
                y: cy,
                vx: Math.cos(angle) * 10,
                vy: Math.sin(angle) * 10,
                angle: angle,
                life: 120,
                damage: 20
            });
            this.facing = Math.cos(angle) >= 0 ? 1 : -1;
        }
    }
 
    getSwordHitbox() {
        if (!this.isAttacking || this.weapon !== 'sword') return null;
        const range = 35;
        const hitW = 30;
        const hitH = 30;
        return {
            x: this.facing > 0 ? this.x + this.w : this.x - hitW,
            y: this.y + 5,
            w: hitW + range * (this.attackFrame / this.attackDuration),
            h: hitH,
            damage: 30
        };
    }
 
    takeDamage(amount) {
        if (this.invincible > 0 || !this.alive) return;
        this.health -= amount;
        this.invincible = 60;
        if (this.health <= 0) {
            this.health = 0;
            this.alive = false;
            this.deathTimer = 0;
        }
    }
 
    knockback(fromX, fromY, force) {
        const angle = angleTo(fromX, fromY, this.x + this.w / 2, this.y + this.h / 2);
        this.knockbackX = Math.cos(angle) * force;
        this.knockbackY = Math.sin(angle) * force - 2;
    }
 
    draw(ctx, ox, oy, time) {
        if (!this.alive) {
            // Death animation
            ctx.globalAlpha = Math.max(0, 1 - this.deathTimer / 60);
            this._drawBody(ctx, ox, oy, time);
            ctx.globalAlpha = 1;
            return;
        }
 
        // Invincibility flicker
        if (this.invincible > 0 && Math.floor(this.invincible / 4) % 2 === 0) return;
 
        this._drawBody(ctx, ox, oy, time);
    }
 
    _drawBody(ctx, ox, oy, time) {
        const dx = this.x + ox;
        const dy = this.y + oy;
        const f = this.facing;
        const bob = Math.sin(this.walkCycle) * 2;
        const legSwing = Math.sin(this.walkCycle * 2) * 5;
 
        // Cape
        ctx.fillStyle = COLORS.playerCape;
        const capeWave = Math.sin(time * 0.05 + this.x * 0.1) * 3;
        Renderer.polygon([
            [dx + this.w / 2 - f * 2, dy + 8],
            [dx + this.w / 2 - f * 12 + capeWave, dy + this.h + 5],
            [dx + this.w / 2 - f * 5, dy + this.h + 5],
            [dx + this.w / 2 - f * 0, dy + 12],
        ], COLORS.playerCape, '#5a0000');
 
        // Legs
        ctx.fillStyle = COLORS.stoneDark;
        ctx.fillRect(dx + 5, dy + 28 + bob, 5, 12);
        ctx.fillRect(dx + 14, dy + 28 + bob, 5, 12);
        // Leg animation
        if (Math.abs(this.vx) > 0.5) {
            ctx.fillRect(dx + 5 + legSwing * 0.3, dy + 28 + bob, 5, 12);
            ctx.fillRect(dx + 14 - legSwing * 0.3, dy + 28 + bob, 5, 12);
        }
 
        // Body (armor)
        ctx.fillStyle = COLORS.playerArmor;
        Renderer.polygon([
            [dx + 3, dy + 10 + bob],
            [dx + this.w - 3, dy + 10 + bob],
            [dx + this.w - 5, dy + 30 + bob],
            [dx + 5, dy + 30 + bob],
        ], COLORS.playerArmor, COLORS.playerArmorLight);
        // Armor detail
        ctx.fillStyle = COLORS.playerArmorLight;
        ctx.fillRect(dx + 10, dy + 14 + bob, 4, 10);
 
        // Arms
        const armY = dy + 14 + bob;
        if (this.isAttacking && this.weapon === 'sword') {
            // Sword swing
            const swingAngle = -Math.PI / 2 + (this.attackFrame / this.attackDuration) * Math.PI;
            const armEndX = dx + this.w / 2 + Math.cos(swingAngle) * 20 * f;
            const armEndY = armY + Math.sin(swingAngle) * 20;
            ctx.strokeStyle = COLORS.playerSkin;
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(dx + this.w / 2 + f * 5, armY);
            ctx.lineTo(armEndX, armEndY);
            ctx.stroke();
            // Sword
            const swordEndX = armEndX + Math.cos(swingAngle) * 25 * f;
            const swordEndY = armEndY + Math.sin(swingAngle) * 25;
            ctx.strokeStyle = COLORS.swordSteel;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(armEndX, armEndY);
            ctx.lineTo(swordEndX, swordEndY);
            ctx.stroke();
            // Hilt
            ctx.strokeStyle = COLORS.swordHilt;
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.moveTo(armEndX - 4, armEndY);
            ctx.lineTo(armEndX + 4, armEndY);
            ctx.stroke();
        } else {
            // Normal arm / holding weapon
            ctx.fillStyle = COLORS.playerSkin;
            ctx.fillRect(dx + (f > 0 ? this.w - 3 : -3), armY, 6, 4);
            // Weapon in hand
            if (this.weapon === 'sword') {
                ctx.strokeStyle = COLORS.swordSteel;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(dx + this.w / 2 + f * 10, armY + 2);
                ctx.lineTo(dx + this.w / 2 + f * 25, armY - 10);
                ctx.stroke();
            } else {
                // Bow
                ctx.strokeStyle = COLORS.bowWood;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(dx + this.w / 2 + f * 12, armY + 5, 12, -Math.PI * 0.4, Math.PI * 0.4);
                ctx.stroke();
                // String
                ctx.strokeStyle = '#ccc';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(dx + this.w / 2 + f * 12 + Math.cos(-Math.PI * 0.4) * 12,
                    armY + 5 + Math.sin(-Math.PI * 0.4) * 12);
                ctx.lineTo(dx + this.w / 2 + f * 12 + Math.cos(Math.PI * 0.4) * 12,
                    armY + 5 + Math.sin(Math.PI * 0.4) * 12);
                ctx.stroke();
            }
        }
 
        // Head
        ctx.fillStyle = COLORS.playerSkin;
        ctx.fillRect(dx + 6, dy + bob, 12, 12);
        // Helmet
        ctx.fillStyle = COLORS.playerArmor;
        Renderer.polygon([
            [dx + 4, dy + 8 + bob],
            [dx + 6, dy - 2 + bob],
            [dx + 18, dy - 2 + bob],
            [dx + 20, dy + 8 + bob],
        ], COLORS.playerArmor, COLORS.playerArmorLight);
        // Visor
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(dx + (f > 0 ? 12 : 7), dy + 3 + bob, 5, 3);
        // Helmet plume
        ctx.fillStyle = COLORS.healthRed;
        for (let i = 0; i < 4; i++) {
            ctx.fillRect(dx + 9 + i * 2, dy - 5 - i + bob + Math.sin(time * 0.08 + i) * 1, 2, 4);
        }
    }
 
    drawArrows(ctx, ox, oy) {
        for (const a of this.arrows) {
            const dx = a.x + ox;
            const dy = a.y + oy;
            ctx.save();
            ctx.translate(dx, dy);
            ctx.rotate(a.angle);
            // Arrow shaft
            ctx.fillStyle = COLORS.arrowWood;
            ctx.fillRect(-12, -1, 24, 2);
            // Arrow head
            Renderer.polygon([
                [12, -3],
                [18, 0],
                [12, 3]
            ], COLORS.swordSteel);
            // Fletching
            Renderer.polygon([
                [-12, -3],
                [-8, 0],
                [-12, 3]
            ], COLORS.healthRed);
            ctx.restore();
        }
    }
}
