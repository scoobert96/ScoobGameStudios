// ============================================================
// SWORDCERY - Enemy Types
// Skeletons, Witches, Trolls with AI and rendering
// ============================================================
 
class Enemy {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.type = type;
        this.alive = true;
        this.deathTimer = 0;
        this.animTimer = 0;
        this.facing = -1;
        this.attackCooldown = 0;
        this.isAttacking = false;
        this.attackFrame = 0;
        this.hitFlash = 0;
        this.scoreValue = 0;
        this.patrolDir = 1;
        this.patrolTimer = 0;
        this.aggroRange = 250;
        this.aggroed = false;
        this.projectiles = [];
 
        this.initType(type);
    }
 
    initType(type) {
        switch (type) {
            case 'skeleton':
                this.w = 20;
                this.h = 36;
                this.maxHealth = 40;
                this.health = 40;
                this.damage = 10;
                this.speed = 1.2;
                this.scoreValue = 100;
                this.aggroRange = 200;
                break;
            case 'skeleton_archer':
                this.w = 20;
                this.h = 36;
                this.maxHealth = 30;
                this.health = 30;
                this.damage = 12;
                this.speed = 0.8;
                this.scoreValue = 150;
                this.aggroRange = 350;
                break;
            case 'witch':
                this.w = 22;
                this.h = 38;
                this.maxHealth = 60;
                this.health = 60;
                this.damage = 18;
                this.speed = 1.5;
                this.scoreValue = 250;
                this.aggroRange = 300;
                break;
            case 'troll':
                this.w = 36;
                this.h = 50;
                this.maxHealth = 120;
                this.health = 120;
                this.damage = 25;
                this.speed = 0.7;
                this.scoreValue = 400;
                this.aggroRange = 180;
                break;
            case 'boss_necromancer':
                this.w = 30;
                this.h = 48;
                this.maxHealth = 300;
                this.health = 300;
                this.damage = 30;
                this.speed = 1.0;
                this.scoreValue = 1000;
                this.aggroRange = 400;
                break;
        }
    }
 
    update(player, platforms) {
        if (!this.alive) {
            this.deathTimer++;
            return;
        }
 
        this.animTimer++;
        if (this.hitFlash > 0) this.hitFlash--;
        if (this.attackCooldown > 0) this.attackCooldown--;
 
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
 
        this.aggroed = distance < this.aggroRange && player.alive;
 
        if (this.aggroed) {
            this.facing = dx > 0 ? 1 : -1;
            this.ai(player, distance, dx, dy);
        } else {
            this.patrol();
        }
 
        // Physics
        this.vy += GRAVITY;
        if (this.vy > MAX_FALL_SPEED) this.vy = MAX_FALL_SPEED;
        this.vx *= 0.8;
        this.x += this.vx;
        this.y += this.vy;
 
        resolveCollision(this, platforms);
 
        // Update projectiles
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const p = this.projectiles[i];
            p.x += p.vx;
            p.y += p.vy;
            if (p.gravity) p.vy += 0.1;
            p.life--;
            if (p.life <= 0) this.projectiles.splice(i, 1);
        }
 
        // Fall death
        if (this.y > 2000) {
            this.alive = false;
        }
    }
 
    patrol() {
        this.patrolTimer++;
        if (this.patrolTimer > 120) {
            this.patrolDir *= -1;
            this.patrolTimer = 0;
        }
        this.vx = this.patrolDir * this.speed * 0.5;
        this.facing = this.patrolDir;
    }
 
    ai(player, distance, dx, dy) {
        switch (this.type) {
            case 'skeleton':
                if (distance > 40) {
                    this.vx = this.facing * this.speed;
                }
                if (distance < 50 && this.attackCooldown <= 0) {
                    this.isAttacking = true;
                    this.attackFrame = 0;
                    this.attackCooldown = 60;
                }
                break;
            case 'skeleton_archer':
                if (distance > 200) {
                    this.vx = this.facing * this.speed;
                } else if (distance < 100) {
                    this.vx = -this.facing * this.speed;
                }
                if (this.attackCooldown <= 0 && distance < 350) {
                    this.shootArrow(player);
                    this.attackCooldown = 90;
                }
                break;
            case 'witch':
                // Float and shoot magic
                if (distance > 150) {
                    this.vx = this.facing * this.speed;
                } else if (distance < 100) {
                    this.vx = -this.facing * this.speed * 0.5;
                }
                if (this.attackCooldown <= 0) {
                    this.shootMagic(player);
                    this.attackCooldown = 70;
                }
                break;
            case 'troll':
                if (distance > 50) {
                    this.vx = this.facing * this.speed;
                }
                if (distance < 60 && this.attackCooldown <= 0) {
                    this.isAttacking = true;
                    this.attackFrame = 0;
                    this.attackCooldown = 80;
                }
                break;
            case 'boss_necromancer':
                if (distance > 200) {
                    this.vx = this.facing * this.speed;
                }
                if (this.attackCooldown <= 0) {
                    if (Math.random() < 0.4) {
                        this.shootMagic(player);
                        this.shootMagic(player, -0.3);
                        this.shootMagic(player, 0.3);
                    } else {
                        this.shootMagic(player);
                    }
                    this.attackCooldown = 50;
                }
                break;
        }
 
        if (this.isAttacking) {
            this.attackFrame++;
            if (this.attackFrame >= 20) {
                this.isAttacking = false;
            }
        }
    }
 
    shootArrow(player) {
        const angle = angleTo(this.x + this.w / 2, this.y + this.h / 2,
            player.x + player.w / 2, player.y + player.h / 2);
        this.projectiles.push({
            x: this.x + this.w / 2,
            y: this.y + this.h / 3,
            vx: Math.cos(angle) * 5,
            vy: Math.sin(angle) * 5,
            life: 90,
            damage: this.damage,
            type: 'arrow',
            gravity: true
        });
    }
 
    shootMagic(player, angleOffset) {
        const angle = angleTo(this.x + this.w / 2, this.y + this.h / 2,
            player.x + player.w / 2, player.y + player.h / 2) + (angleOffset || 0);
        const speed = this.type === 'boss_necromancer' ? 4 : 3;
        this.projectiles.push({
            x: this.x + this.w / 2,
            y: this.y + this.h / 3,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: 120,
            damage: this.damage,
            type: 'magic',
            gravity: false
        });
    }
 
    getAttackHitbox() {
        if (!this.isAttacking) return null;
        const range = this.type === 'troll' ? 50 : 30;
        return {
            x: this.facing > 0 ? this.x + this.w : this.x - range,
            y: this.y,
            w: range,
            h: this.h,
            damage: this.damage
        };
    }
 
    takeDamage(amount) {
        if (!this.alive) return;
        this.health -= amount;
        this.hitFlash = 10;
        if (this.health <= 0) {
            this.health = 0;
            this.alive = false;
            this.deathTimer = 0;
        }
    }
 
    draw(ctx, ox, oy, time) {
        if (!this.alive) {
            if (this.deathTimer < 30) {
                ctx.globalAlpha = 1 - this.deathTimer / 30;
                this._drawBody(ctx, ox, oy, time);
                ctx.globalAlpha = 1;
            }
            return;
        }
 
        if (this.hitFlash > 0 && this.hitFlash % 2 === 0) {
            ctx.globalCompositeOperation = 'lighter';
        }
        this._drawBody(ctx, ox, oy, time);
        ctx.globalCompositeOperation = 'source-over';
 
        // Health bar
        if (this.health < this.maxHealth) {
            const bx = this.x + ox;
            const by = this.y + oy - 8;
            ctx.fillStyle = '#333';
            ctx.fillRect(bx, by, this.w, 4);
            ctx.fillStyle = COLORS.healthRed;
            ctx.fillRect(bx, by, this.w * (this.health / this.maxHealth), 4);
        }
    }
 
    _drawBody(ctx, ox, oy, time) {
        const dx = this.x + ox;
        const dy = this.y + oy;
        const f = this.facing;
        const walk = Math.sin(this.animTimer * 0.1) * 2;
 
        switch (this.type) {
            case 'skeleton':
            case 'skeleton_archer':
                this._drawSkeleton(ctx, dx, dy, f, walk, time);
                break;
            case 'witch':
                this._drawWitch(ctx, dx, dy, f, walk, time);
                break;
            case 'troll':
                this._drawTroll(ctx, dx, dy, f, walk, time);
                break;
            case 'boss_necromancer':
                this._drawNecromancer(ctx, dx, dy, f, walk, time);
                break;
        }
    }
 
    _drawSkeleton(ctx, dx, dy, f, walk, time) {
        const boneColor = this.hitFlash > 0 ? '#fff' : COLORS.skeletonWhite;
        const darkBone = this.hitFlash > 0 ? '#eee' : COLORS.skeletonDark;
 
        // Legs
        ctx.strokeStyle = boneColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(dx + 7, dy + 24);
        ctx.lineTo(dx + 5 + walk, dy + 36);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(dx + 13, dy + 24);
        ctx.lineTo(dx + 15 - walk, dy + 36);
        ctx.stroke();
 
        // Ribcage
        ctx.fillStyle = darkBone;
        ctx.fillRect(dx + 4, dy + 12, 12, 14);
        ctx.strokeStyle = boneColor;
        ctx.lineWidth = 1;
        for (let i = 0; i < 4; i++) {
            ctx.beginPath();
            ctx.moveTo(dx + 5, dy + 14 + i * 3);
            ctx.lineTo(dx + 15, dy + 14 + i * 3);
            ctx.stroke();
        }
 
        // Arms
        ctx.strokeStyle = boneColor;
        ctx.lineWidth = 2;
        if (this.isAttacking || this.type === 'skeleton_archer') {
            const swing = this.isAttacking ? Math.sin(this.attackFrame * 0.3) * 15 : 5;
            ctx.beginPath();
            ctx.moveTo(dx + 10, dy + 14);
            ctx.lineTo(dx + 10 + f * (15 + swing), dy + 14 - swing * 0.5);
            ctx.stroke();
            if (this.type === 'skeleton_archer') {
                // Bow
                ctx.strokeStyle = COLORS.bowWood;
                ctx.beginPath();
                ctx.arc(dx + 10 + f * 18, dy + 14, 8, -Math.PI * 0.4 * f, Math.PI * 0.4 * f);
                ctx.stroke();
            } else {
                // Sword
                ctx.strokeStyle = '#888';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(dx + 10 + f * (15 + swing), dy + 14 - swing * 0.5);
                ctx.lineTo(dx + 10 + f * (30 + swing), dy + 8 - swing);
                ctx.stroke();
            }
        } else {
            ctx.beginPath();
            ctx.moveTo(dx + 5, dy + 14);
            ctx.lineTo(dx + 2, dy + 22 + walk);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(dx + 15, dy + 14);
            ctx.lineTo(dx + 18, dy + 22 - walk);
            ctx.stroke();
        }
 
        // Skull
        ctx.fillStyle = boneColor;
        ctx.fillRect(dx + 4, dy, 12, 12);
        // Eyes
        ctx.fillStyle = this.aggroed ? '#ff3333' : '#333';
        ctx.fillRect(dx + (f > 0 ? 10 : 5), dy + 4, 3, 3);
        ctx.fillRect(dx + (f > 0 ? 6 : 9), dy + 4, 3, 3);
        // Jaw
        ctx.fillStyle = darkBone;
        ctx.fillRect(dx + 6, dy + 9, 8, 3);
    }
 
    _drawWitch(ctx, dx, dy, f, walk, time) {
        const mainColor = this.hitFlash > 0 ? '#cc88ff' : COLORS.witchPurple;
        const darkColor = this.hitFlash > 0 ? '#aa66dd' : COLORS.witchDark;
 
        // Robe
        Renderer.polygon([
            [dx + 3, dy + 12],
            [dx + this.w - 3, dy + 12],
            [dx + this.w + 2, dy + this.h],
            [dx - 2, dy + this.h]
        ], darkColor, mainColor);
 
        // Body
        ctx.fillStyle = mainColor;
        ctx.fillRect(dx + 5, dy + 10, 12, 16);
 
        // Arms
        ctx.strokeStyle = mainColor;
        ctx.lineWidth = 3;
        const armWave = Math.sin(time * 0.05) * 5;
        ctx.beginPath();
        ctx.moveTo(dx + 5, dy + 16);
        ctx.lineTo(dx - 5 + armWave, dy + 22);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(dx + this.w - 5, dy + 16);
        ctx.lineTo(dx + this.w + 5 - armWave, dy + 22);
        ctx.stroke();
 
        // Staff
        ctx.strokeStyle = '#5a3a1a';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(dx + 11 + f * 8, dy + 5);
        ctx.lineTo(dx + 11 + f * 8, dy + this.h);
        ctx.stroke();
        // Staff orb
        ctx.fillStyle = '#ff00ff';
        ctx.beginPath();
        ctx.arc(dx + 11 + f * 8, dy + 3, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'rgba(255,0,255,0.3)';
        ctx.beginPath();
        ctx.arc(dx + 11 + f * 8, dy + 3, 8, 0, Math.PI * 2);
        ctx.fill();
 
        // Head
        ctx.fillStyle = '#90ee90';
        ctx.fillRect(dx + 6, dy + 2, 10, 10);
        // Hat
        Renderer.polygon([
            [dx + 2, dy + 4],
            [dx + 11, dy - 18],
            [dx + 20, dy + 4]
        ], darkColor, mainColor);
        // Hat brim
        ctx.fillStyle = darkColor;
        ctx.fillRect(dx, dy + 2, 22, 3);
        // Eyes
        ctx.fillStyle = '#ff0';
        ctx.fillRect(dx + (f > 0 ? 11 : 7), dy + 5, 2, 2);
        ctx.fillRect(dx + (f > 0 ? 8 : 11), dy + 5, 2, 2);
    }
 
    _drawTroll(ctx, dx, dy, f, walk, time) {
        const mainColor = this.hitFlash > 0 ? '#88aa55' : COLORS.trollGreen;
        const darkColor = this.hitFlash > 0 ? '#668833' : COLORS.trollDark;
 
        // Legs
        ctx.fillStyle = darkColor;
        ctx.fillRect(dx + 5, dy + 35, 10, 15);
        ctx.fillRect(dx + 21, dy + 35, 10, 15);
 
        // Body (large)
        Renderer.polygon([
            [dx + 2, dy + 15],
            [dx + this.w - 2, dy + 15],
            [dx + this.w, dy + 38],
            [dx, dy + 38]
        ], mainColor, darkColor);
 
        // Belt
        ctx.fillStyle = '#8b4513';
        ctx.fillRect(dx + 2, dy + 32, this.w - 4, 4);
 
        // Arms
        ctx.fillStyle = mainColor;
        if (this.isAttacking) {
            const swing = this.attackFrame / 20;
            // Club smash
            ctx.fillRect(dx + (f > 0 ? this.w - 2 : -10), dy + 15, 12, 8);
            // Club
            ctx.fillStyle = '#5a3a1a';
            const clubY = dy + 15 + swing * 30;
            ctx.fillRect(dx + (f > 0 ? this.w + 5 : -18), clubY - 10, 8, 25);
            // Spikes
            ctx.fillStyle = '#888';
            ctx.fillRect(dx + (f > 0 ? this.w + 10 : -14), clubY - 5, 4, 4);
        } else {
            ctx.fillRect(dx - 4, dy + 18, 8, 16);
            ctx.fillRect(dx + this.w - 4, dy + 18, 8, 16);
            // Club in hand
            ctx.fillStyle = '#5a3a1a';
            ctx.fillRect(dx + (f > 0 ? this.w + 1 : -12), dy + 22, 8, 20);
        }
 
        // Head
        ctx.fillStyle = mainColor;
        ctx.fillRect(dx + 8, dy, 20, 18);
        // Eyes
        ctx.fillStyle = this.aggroed ? '#ff4444' : '#ffff00';
        ctx.fillRect(dx + (f > 0 ? 18 : 10), dy + 6, 4, 4);
        ctx.fillRect(dx + (f > 0 ? 12 : 18), dy + 6, 4, 4);
        // Underbite
        ctx.fillStyle = darkColor;
        ctx.fillRect(dx + 10, dy + 14, 16, 5);
        ctx.fillStyle = '#fff';
        ctx.fillRect(dx + 13, dy + 13, 3, 3);
        ctx.fillRect(dx + 19, dy + 13, 3, 3);
        // Ears
        ctx.fillStyle = mainColor;
        ctx.fillRect(dx + 5, dy + 4, 5, 8);
        ctx.fillRect(dx + 26, dy + 4, 5, 8);
    }
 
    _drawNecromancer(ctx, dx, dy, f, walk, time) {
        const mainColor = this.hitFlash > 0 ? '#8844aa' : '#3d0066';
        const darkColor = this.hitFlash > 0 ? '#6622aa' : '#1a0033';
        const accentColor = '#00ff88';
 
        // Flowing robe
        const robeWave = Math.sin(time * 0.03) * 3;
        Renderer.polygon([
            [dx + 2, dy + 14],
            [dx + this.w - 2, dy + 14],
            [dx + this.w + 5 + robeWave, dy + this.h],
            [dx - 5 - robeWave, dy + this.h]
        ], darkColor, mainColor);
 
        // Robe details
        ctx.strokeStyle = accentColor;
        ctx.lineWidth = 1;
        for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.moveTo(dx + 5, dy + 20 + i * 8);
            ctx.lineTo(dx + this.w - 5, dy + 20 + i * 8);
            ctx.stroke();
        }
 
        // Arms (magical gestures)
        const armAngle = Math.sin(time * 0.04) * 0.5;
        ctx.strokeStyle = '#90ee90';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(dx + 5, dy + 18);
        ctx.lineTo(dx - 8 + Math.cos(armAngle) * 10, dy + 14 + Math.sin(armAngle) * 5);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(dx + this.w - 5, dy + 18);
        ctx.lineTo(dx + this.w + 8 + Math.cos(armAngle + Math.PI) * 10, dy + 14 + Math.sin(armAngle + Math.PI) * 5);
        ctx.stroke();
 
        // Magic glow on hands
        ctx.fillStyle = 'rgba(0,255,136,0.4)';
        ctx.beginPath();
        ctx.arc(dx - 8 + Math.cos(armAngle) * 10, dy + 14 + Math.sin(armAngle) * 5, 6, 0, Math.PI * 2);
        ctx.fill();
 
        // Staff
        ctx.strokeStyle = '#2a0044';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(dx + 15 + f * 5, dy - 5);
        ctx.lineTo(dx + 15 + f * 5, dy + this.h);
        ctx.stroke();
        // Skull on staff
        ctx.fillStyle = COLORS.skeletonWhite;
        ctx.fillRect(dx + 12 + f * 5, dy - 10, 8, 8);
        ctx.fillStyle = accentColor;
        ctx.fillRect(dx + 13 + f * 5, dy - 8, 2, 2);
        ctx.fillRect(dx + 17 + f * 5, dy - 8, 2, 2);
 
        // Hooded head
        Renderer.polygon([
            [dx + 3, dy + 14],
            [dx + 15, dy - 4],
            [dx + this.w - 3, dy + 14]
        ], darkColor, mainColor);
        // Glowing eyes
        ctx.fillStyle = accentColor;
        ctx.fillRect(dx + (f > 0 ? 14 : 10), dy + 6, 3, 2);
        ctx.fillRect(dx + (f > 0 ? 10 : 16), dy + 6, 3, 2);
        // Eye glow
        ctx.fillStyle = 'rgba(0,255,136,0.3)';
        ctx.beginPath();
        ctx.arc(dx + 15, dy + 7, 8, 0, Math.PI * 2);
        ctx.fill();
    }
 
    drawProjectiles(ctx, ox, oy, time) {
        for (const p of this.projectiles) {
            const dx = p.x + ox;
            const dy = p.y + oy;
            if (p.type === 'arrow') {
                ctx.save();
                ctx.translate(dx, dy);
                ctx.rotate(Math.atan2(p.vy, p.vx));
                ctx.fillStyle = COLORS.arrowWood;
                ctx.fillRect(-8, -1, 16, 2);
                ctx.fillStyle = '#888';
                Renderer.polygon([[8, -2], [12, 0], [8, 2]], '#888');
                ctx.restore();
            } else if (p.type === 'magic') {
                ctx.fillStyle = this.type === 'boss_necromancer' ? '#00ff88' : '#ff00ff';
                ctx.beginPath();
                ctx.arc(dx, dy, 5, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = this.type === 'boss_necromancer' ?
                    'rgba(0,255,136,0.3)' : 'rgba(255,0,255,0.3)';
                ctx.beginPath();
                ctx.arc(dx, dy, 10 + Math.sin(time * 0.1) * 3, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }
}