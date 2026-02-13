// ============================================================
// SWORDCERY - Pseudo-3D Renderer
// N64-era polygon aesthetic rendering functions
// ============================================================
 
const Renderer = {
    ctx: null,
    init(ctx) {
        this.ctx = ctx;
    },
 
    // Draw a flat-shaded polygon (N64 style)
    polygon(points, color, outline) {
        const ctx = this.ctx;
        ctx.beginPath();
        ctx.moveTo(points[0][0], points[0][1]);
        for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i][0], points[i][1]);
        }
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
        if (outline) {
            ctx.strokeStyle = outline;
            ctx.lineWidth = 1;
            ctx.stroke();
        }
    },
 
    // Draw a 3D-looking block (like N64 geometry)
    block3D(x, y, w, h, depth, faceColor, topColor, sideColor, ox, oy) {
        const ctx = this.ctx;
        const dx = x + ox;
        const dy = y + oy;
        const d = depth;
        // Front face
        ctx.fillStyle = faceColor;
        ctx.fillRect(dx, dy, w, h);
        // Top face
        this.polygon([
            [dx, dy],
            [dx + d * 0.5, dy - d * 0.5],
            [dx + w + d * 0.5, dy - d * 0.5],
            [dx + w, dy]
        ], topColor);
        // Right face
        this.polygon([
            [dx + w, dy],
            [dx + w + d * 0.5, dy - d * 0.5],
            [dx + w + d * 0.5, dy + h - d * 0.5],
            [dx + w, dy + h]
        ], sideColor);
    },
 
    // Draw stone block with mortar lines
    stoneBlock(x, y, w, h, ox, oy, variant) {
        const dx = x + ox;
        const dy = y + oy;
        const ctx = this.ctx;
        const colors = [
            [COLORS.stoneLight, COLORS.stoneMid, COLORS.stoneDark],
            [COLORS.stoneMid, COLORS.stoneDark, '#3a3a38'],
            [COLORS.stoneAccent, COLORS.stoneMid, COLORS.stoneDark],
        ];
        const c = colors[variant % 3];
        // 3D block
        this.block3D(x, y, w, h, 8, c[0], c[1], c[2], ox, oy);
        // Mortar lines
        ctx.strokeStyle = COLORS.mortar;
        ctx.lineWidth = 1;
        const brickH = h / 3;
        for (let row = 0; row < 3; row++) {
            const by = dy + row * brickH;
            ctx.beginPath();
            ctx.moveTo(dx, by);
            ctx.lineTo(dx + w, by);
            ctx.stroke();
            const offset = row % 2 === 0 ? w / 3 : w / 3 * 2;
            ctx.beginPath();
            ctx.moveTo(dx + offset, by);
            ctx.lineTo(dx + offset, by + brickH);
            ctx.stroke();
        }
    },
 
    // Draw wooden platform (bridge)
    woodPlatform(x, y, w, h, ox, oy) {
        const dx = x + ox;
        const dy = y + oy;
        const ctx = this.ctx;
        this.block3D(x, y, w, h, 6, COLORS.woodLight, COLORS.woodDark, COLORS.woodAccent, ox, oy);
        // Plank lines
        ctx.strokeStyle = COLORS.woodDark;
        ctx.lineWidth = 1;
        const plankW = 30;
        for (let px = 0; px < w; px += plankW) {
            ctx.beginPath();
            ctx.moveTo(dx + px, dy);
            ctx.lineTo(dx + px, dy + h);
            ctx.stroke();
        }
    },
 
    // Draw fortress wall segment
    fortressWall(x, y, w, h, ox, oy) {
        const dx = x + ox;
        const dy = y + oy;
        const ctx = this.ctx;
        // Main wall
        this.block3D(x, y, w, h, 12, COLORS.stoneMid, COLORS.stoneLight, COLORS.stoneDark, ox, oy);
        // Battlements on top
        const merlonW = 20;
        const merlonH = 15;
        const gap = 15;
        for (let mx = 0; mx < w; mx += merlonW + gap) {
            this.block3D(x + mx, y - merlonH, Math.min(merlonW, w - mx), merlonH, 8,
                COLORS.stoneLight, COLORS.stoneAccent, COLORS.stoneDark, ox, oy);
        }
        // Mortar pattern
        ctx.strokeStyle = COLORS.mortar;
        ctx.lineWidth = 1;
        const brickH = 20;
        for (let row = 0; row < Math.ceil(h / brickH); row++) {
            const by = dy + row * brickH;
            ctx.beginPath();
            ctx.moveTo(dx, by);
            ctx.lineTo(dx + w, by);
            ctx.stroke();
            const brickW = 40;
            const offset = (row % 2) * brickW / 2;
            for (let col = offset; col < w; col += brickW) {
                ctx.beginPath();
                ctx.moveTo(dx + col, by);
                ctx.lineTo(dx + col, by + brickH);
                ctx.stroke();
            }
        }
    },
 
    // Draw parallax sky background
    drawSky(camera, levelWidth) {
        const ctx = this.ctx;
        const grad = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
        grad.addColorStop(0, COLORS.skyTop);
        grad.addColorStop(0.4, COLORS.skyMid);
        grad.addColorStop(0.7, COLORS.skyBottom);
        grad.addColorStop(0.85, COLORS.sunsetOrange);
        grad.addColorStop(1, COLORS.sunsetPink);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
 
        // Stars
        const starSeed = 42;
        for (let i = 0; i < 60; i++) {
            const sx = ((i * 137 + starSeed) % 960);
            const sy = ((i * 91 + starSeed) % 300);
            const sz = 1 + (i % 3);
            const alpha = 0.3 + (Math.sin(Date.now() * 0.002 + i) * 0.3);
            ctx.fillStyle = `rgba(255,255,220,${alpha})`;
            ctx.fillRect(sx, sy, sz, sz);
        }
 
        // Moon
        const moonX = 750 - camera.x * 0.02;
        const moonY = 80;
        ctx.fillStyle = '#f5f0d0';
        ctx.beginPath();
        ctx.arc(moonX, moonY, 30, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#e8e0c0';
        ctx.beginPath();
        ctx.arc(moonX - 5, moonY - 5, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(moonX + 10, moonY + 8, 5, 0, Math.PI * 2);
        ctx.fill();
    },
 
    // Draw background mountains/castles (parallax)
    drawBgCastles(camera, levelWidth) {
        const ctx = this.ctx;
        const ox = -camera.x * 0.15;
        // Distant mountains
        ctx.fillStyle = '#2a1a4a';
        ctx.beginPath();
        ctx.moveTo(ox, CANVAS_HEIGHT);
        for (let i = 0; i <= levelWidth * 0.3; i += 80) {
            const h = 150 + Math.sin(i * 0.01) * 80 + Math.cos(i * 0.007) * 50;
            ctx.lineTo(ox + i, CANVAS_HEIGHT - h);
        }
        ctx.lineTo(ox + levelWidth * 0.3, CANVAS_HEIGHT);
        ctx.fill();
 
        // Mid castles
        const ox2 = -camera.x * 0.3;
        ctx.fillStyle = '#3d2a5c';
        for (let i = 0; i < 4; i++) {
            const cx = ox2 + i * 400 + 100;
            const cy = CANVAS_HEIGHT - 200;
            // Tower
            ctx.fillRect(cx, cy - 100, 30, 100);
            ctx.fillRect(cx + 60, cy - 80, 30, 80);
            // Wall
            ctx.fillRect(cx, cy, 90, 50);
            // Battlements
            for (let b = 0; b < 5; b++) {
                ctx.fillRect(cx + b * 20, cy - 115, 10, 15);
            }
        }
 
        // Near trees
        const ox3 = -camera.x * 0.5;
        for (let i = 0; i < 8; i++) {
            const tx = ox3 + i * 250 + 50;
            const ty = CANVAS_HEIGHT - 60;
            ctx.fillStyle = '#1a3a1a';
            ctx.fillRect(tx + 10, ty - 40, 8, 40);
            ctx.fillStyle = '#1a4a1a';
            ctx.beginPath();
            ctx.moveTo(tx, ty - 30);
            ctx.lineTo(tx + 14, ty - 70);
            ctx.lineTo(tx + 28, ty - 30);
            ctx.fill();
        }
    },
 
    // Draw decorative torch
    drawTorch(x, y, ox, oy, time) {
        const ctx = this.ctx;
        const dx = x + ox;
        const dy = y + oy;
        // Bracket
        ctx.fillStyle = '#4a4a4a';
        ctx.fillRect(dx - 2, dy, 4, 15);
        // Flame
        const flicker = Math.sin(time * 0.01 + x) * 3;
        ctx.fillStyle = COLORS.lavaYellow;
        ctx.beginPath();
        ctx.ellipse(dx, dy - 5 + flicker, 5, 8, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = COLORS.lavaOrange;
        ctx.beginPath();
        ctx.ellipse(dx, dy - 3 + flicker, 3, 5, 0, 0, Math.PI * 2);
        ctx.fill();
        // Glow
        const grd = ctx.createRadialGradient(dx, dy + flicker, 0, dx, dy + flicker, 50);
        grd.addColorStop(0, 'rgba(255,165,0,0.15)');
        grd.addColorStop(1, 'rgba(255,165,0,0)');
        ctx.fillStyle = grd;
        ctx.fillRect(dx - 50, dy - 50, 100, 100);
    }
};