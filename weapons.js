// ============================================================
// SWORDCERY - Weapons System
// Weapon data and projectile management
// ============================================================
 
const WeaponData = {
    sword: {
        name: 'Iron Sword',
        damage: 30,
        range: 40,
        cooldown: 25,
        staminaCost: 20,
        icon: function(ctx, x, y, size) {
            // Blade
            ctx.strokeStyle = COLORS.swordSteel;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(x, y + size);
            ctx.lineTo(x, y - size * 0.3);
            ctx.stroke();
            // Point
            ctx.beginPath();
            ctx.moveTo(x - 3, y - size * 0.3);
            ctx.lineTo(x, y - size * 0.6);
            ctx.lineTo(x + 3, y - size * 0.3);
            ctx.closePath();
            ctx.fillStyle = COLORS.swordSteel;
            ctx.fill();
            // Guard
            ctx.strokeStyle = COLORS.swordHilt;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(x - 6, y + size * 0.5);
            ctx.lineTo(x + 6, y + size * 0.5);
            ctx.stroke();
            // Grip
            ctx.fillStyle = COLORS.swordHilt;
            ctx.fillRect(x - 2, y + size * 0.5, 4, size * 0.4);
        }
    },
    bow: {
        name: 'Longbow',
        damage: 20,
        range: 500,
        cooldown: 35,
        staminaCost: 20,
        icon: function(ctx, x, y, size) {
            // Bow
            ctx.strokeStyle = COLORS.bowWood;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(x - 4, y, size * 0.7, -Math.PI * 0.4, Math.PI * 0.4);
            ctx.stroke();
            // String
            ctx.strokeStyle = '#ccc';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(x - 4 + Math.cos(-Math.PI * 0.4) * size * 0.7,
                y + Math.sin(-Math.PI * 0.4) * size * 0.7);
            ctx.lineTo(x - 4 + Math.cos(Math.PI * 0.4) * size * 0.7,
                y + Math.sin(Math.PI * 0.4) * size * 0.7);
            ctx.stroke();
            // Arrow
            ctx.strokeStyle = COLORS.arrowWood;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(x - 2, y + size * 0.5);
            ctx.lineTo(x + 6, y - size * 0.5);
            ctx.stroke();
            // Arrowhead
            ctx.fillStyle = COLORS.swordSteel;
            ctx.beginPath();
            ctx.moveTo(x + 4, y - size * 0.4);
            ctx.lineTo(x + 8, y - size * 0.6);
            ctx.lineTo(x + 6, y - size * 0.35);
            ctx.fill();
        }
    }
};
 
// Pickup items that appear in levels
class HealthPickup {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.w = 16;
        this.h = 16;
        this.active = true;
        this.bobTimer = Math.random() * Math.PI * 2;
        this.healAmount = 25;
    }
    update() {
        this.bobTimer += 0.05;
    }
    draw(ctx, ox, oy) {
        if (!this.active) return;
        const dx = this.x + ox;
        const dy = this.y + oy + Math.sin(this.bobTimer) * 4;
        // Potion bottle
        ctx.fillStyle = '#aa2222';
        ctx.fillRect(dx + 3, dy + 4, 10, 10);
        ctx.fillStyle = '#cc3333';
        ctx.fillRect(dx + 5, dy + 2, 6, 4);
        ctx.fillStyle = '#884444';
        ctx.fillRect(dx + 6, dy, 4, 3);
        // Glow
        ctx.fillStyle = 'rgba(255,50,50,0.2)';
        ctx.beginPath();
        ctx.arc(dx + 8, dy + 8, 12, 0, Math.PI * 2);
        ctx.fill();
    }
}
 
class StaminaPickup {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.w = 16;
        this.h = 16;
        this.active = true;
        this.bobTimer = Math.random() * Math.PI * 2;
        this.amount = 30;
    }
    update() {
        this.bobTimer += 0.05;
    }
    draw(ctx, ox, oy) {
        if (!this.active) return;
        const dx = this.x + ox;
        const dy = this.y + oy + Math.sin(this.bobTimer) * 4;
        // Golden flask
        ctx.fillStyle = '#aa8800';
        ctx.fillRect(dx + 3, dy + 4, 10, 10);
        ctx.fillStyle = '#ddaa00';
        ctx.fillRect(dx + 5, dy + 2, 6, 4);
        ctx.fillStyle = '#886600';
        ctx.fillRect(dx + 6, dy, 4, 3);
        // Glow
        ctx.fillStyle = 'rgba(255,215,0,0.2)';
        ctx.beginPath();
        ctx.arc(dx + 8, dy + 8, 12, 0, Math.PI * 2);
        ctx.fill();
    }
}
 
class ScoreGem {
    constructor(x, y, value) {
        this.x = x;
        this.y = y;
        this.w = 12;
        this.h = 12;
        this.active = true;
        this.bobTimer = Math.random() * Math.PI * 2;
        this.value = value || 50;
        this.color = value >= 200 ? '#ff1493' : value >= 100 ? '#9b30ff' : '#00bfff';
    }
    update() {
        this.bobTimer += 0.06;
    }
    draw(ctx, ox, oy) {
        if (!this.active) return;
        const dx = this.x + ox;
        const dy = this.y + oy + Math.sin(this.bobTimer) * 3;
        // Diamond shape
        Renderer.polygon([
            [dx + 6, dy],
            [dx + 12, dy + 6],
            [dx + 6, dy + 12],
            [dx, dy + 6]
        ], this.color, '#fff');
        // Inner shine
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.fillRect(dx + 4, dy + 3, 3, 3);
        // Glow
        ctx.fillStyle = this.color.replace(')', ',0.15)').replace('rgb', 'rgba');
        ctx.beginPath();
        ctx.arc(dx + 6, dy + 6, 10, 0, Math.PI * 2);
        ctx.fill();
    }
}