// ============================================================
// SWORDCERY - Particle System
// Visual effects for hits, pickups, environment
// ============================================================
 
class Particle {
    constructor(x, y, vx, vy, color, life, size) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.life = life;
        this.maxLife = life;
        this.size = size || 3;
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.1;
        this.life--;
    }
    draw(ctx, ox, oy) {
        const alpha = this.life / this.maxLife;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x + ox - this.size / 2, this.y + oy - this.size / 2, this.size, this.size);
        ctx.globalAlpha = 1;
    }
}
 
class ParticleSystem {
    constructor() {
        this.particles = [];
    }
    emit(x, y, count, colors, speedRange, lifeRange, sizeRange) {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = randRange(speedRange[0], speedRange[1]);
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed - 1;
            const color = colors[Math.floor(Math.random() * colors.length)];
            const life = randInt(lifeRange[0], lifeRange[1]);
            const size = randRange(sizeRange[0], sizeRange[1]);
            this.particles.push(new Particle(x, y, vx, vy, color, life, size));
        }
    }
    emitDirectional(x, y, count, colors, angle, spread, speedRange, lifeRange, sizeRange) {
        for (let i = 0; i < count; i++) {
            const a = angle + (Math.random() - 0.5) * spread;
            const speed = randRange(speedRange[0], speedRange[1]);
            const vx = Math.cos(a) * speed;
            const vy = Math.sin(a) * speed;
            const color = colors[Math.floor(Math.random() * colors.length)];
            const life = randInt(lifeRange[0], lifeRange[1]);
            const size = randRange(sizeRange[0], sizeRange[1]);
            this.particles.push(new Particle(x, y, vx, vy, color, life, size));
        }
    }
    update() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            this.particles[i].update();
            if (this.particles[i].life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }
    draw(ctx, ox, oy) {
        for (const p of this.particles) {
            p.draw(ctx, ox, oy);
        }
    }
    clear() {
        this.particles = [];
    }
}