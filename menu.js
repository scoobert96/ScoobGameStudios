// ============================================================
// SWORDCERY - Main Menu
// Title screen with medieval fantasy aesthetic
// ============================================================
 
const MainMenu = {
    selected: 0,
    stars: [],
    torchTimer: 0,
 
    init() {
        // Generate decorative stars
        this.stars = [];
        for (let i = 0; i < 80; i++) {
            this.stars.push({
                x: Math.random() * CANVAS_WIDTH,
                y: Math.random() * CANVAS_HEIGHT * 0.6,
                size: 1 + Math.random() * 2,
                speed: 0.2 + Math.random() * 0.5,
                phase: Math.random() * Math.PI * 2
            });
        }
    },
 
    update(time) {
        this.torchTimer = time;
 
        // Click detection
        if (Input.mouse.clicked) {
            const mx = Input.mouse.x;
            const my = Input.mouse.y;
            // Start button
            if (mx > CANVAS_WIDTH / 2 - 120 && mx < CANVAS_WIDTH / 2 + 120 &&
                my > 380 && my < 420) {
                Input.clearClick();
                return 'start';
            }
            // Controls button
            if (mx > CANVAS_WIDTH / 2 - 120 && mx < CANVAS_WIDTH / 2 + 120 &&
                my > 435 && my < 475) {
                Input.clearClick();
                return 'controls';
            }
        }
        Input.clearClick();
        return null;
    },
 
    draw(ctx, time) {
        // Sky background
        const grad = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
        grad.addColorStop(0, '#0a0520');
        grad.addColorStop(0.3, '#1a0a3a');
        grad.addColorStop(0.6, '#2d1050');
        grad.addColorStop(0.8, '#4a1a2a');
        grad.addColorStop(1, '#1a0a10');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
 
        // Stars
        for (const s of this.stars) {
            const alpha = 0.3 + Math.sin(time * 0.003 * s.speed + s.phase) * 0.4;
            ctx.fillStyle = `rgba(255,255,220,${Math.max(0, alpha)})`;
            ctx.fillRect(s.x, s.y, s.size, s.size);
        }
 
        // Moon
        ctx.fillStyle = '#f5f0d0';
        ctx.beginPath();
        ctx.arc(780, 80, 35, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#e0d8b0';
        ctx.beginPath();
        ctx.arc(773, 73, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(790, 88, 6, 0, Math.PI * 2);
        ctx.fill();
 
        // Castle silhouette
        ctx.fillStyle = '#0a0510';
        // Left tower
        ctx.fillRect(80, 350, 50, 290);
        ctx.fillRect(70, 340, 70, 15);
        for (let i = 0; i < 4; i++) ctx.fillRect(75 + i * 18, 325, 10, 20);
        // Center wall
        ctx.fillRect(130, 420, 200, 220);
        for (let i = 0; i < 10; i++) ctx.fillRect(133 + i * 20, 405, 12, 20);
        // Right tower
        ctx.fillRect(330, 370, 50, 270);
        ctx.fillRect(320, 360, 70, 15);
        for (let i = 0; i < 4; i++) ctx.fillRect(325 + i * 18, 345, 10, 20);
        // Far right tower
        ctx.fillRect(700, 380, 45, 260);
        ctx.fillRect(690, 370, 65, 15);
        for (let i = 0; i < 4; i++) ctx.fillRect(695 + i * 16, 355, 8, 18);
        // Far right wall
        ctx.fillRect(745, 450, 180, 190);
        for (let i = 0; i < 9; i++) ctx.fillRect(748 + i * 20, 435, 12, 20);
 
        // Gate
        ctx.fillStyle = '#1a0a20';
        ctx.beginPath();
        ctx.arc(230, 640, 40, Math.PI, 0);
        ctx.fillRect(190, 500, 80, 140);
        ctx.fill();
        // Gate bars
        ctx.strokeStyle = '#2a1a30';
        ctx.lineWidth = 2;
        for (let i = 0; i < 5; i++) {
            ctx.beginPath();
            ctx.moveTo(198 + i * 16, 500);
            ctx.lineTo(198 + i * 16, 640);
            ctx.stroke();
        }
 
        // Torches on castle
        this.drawMenuTorch(ctx, 180, 490, time);
        this.drawMenuTorch(ctx, 280, 490, time);
        this.drawMenuTorch(ctx, 100, 420, time);
        this.drawMenuTorch(ctx, 340, 430, time);
 
        // Ground
        ctx.fillStyle = '#0a0510';
        ctx.fillRect(0, 590, CANVAS_WIDTH, 50);
        ctx.fillStyle = '#120820';
        ctx.fillRect(0, 580, CANVAS_WIDTH, 15);
 
        // Title background glow
        const titleGlow = ctx.createRadialGradient(CANVAS_WIDTH / 2, 180, 0, CANVAS_WIDTH / 2, 180, 250);
        titleGlow.addColorStop(0, 'rgba(255,180,50,0.12)');
        titleGlow.addColorStop(1, 'rgba(255,180,50,0)');
        ctx.fillStyle = titleGlow;
        ctx.fillRect(0, 0, CANVAS_WIDTH, 400);
 
        // Title: SWORDCERY
        const titleY = 160;
        // Shadow
        ctx.fillStyle = '#1a0a00';
        ctx.font = 'bold 72px "Courier New", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('SWORDCERY', CANVAS_WIDTH / 2 + 3, titleY + 3);
        // Main title
        const titleGrad = ctx.createLinearGradient(0, titleY - 50, 0, titleY + 20);
        titleGrad.addColorStop(0, '#ffd700');
        titleGrad.addColorStop(0.5, '#ffaa00');
        titleGrad.addColorStop(1, '#cc6600');
        ctx.fillStyle = titleGrad;
        ctx.fillText('SWORDCERY', CANVAS_WIDTH / 2, titleY);
        // Outline
        ctx.strokeStyle = '#8b4513';
        ctx.lineWidth = 2;
        ctx.strokeText('SWORDCERY', CANVAS_WIDTH / 2, titleY);
 
        // Subtitle
        ctx.fillStyle = '#c0a080';
        ctx.font = '18px "Courier New", monospace';
        ctx.fillText('~ A Tale of Blades & Spells ~', CANVAS_WIDTH / 2, titleY + 35);
 
        // Decorative line
        ctx.strokeStyle = COLORS.textGold;
        ctx.lineWidth = 1;
        const lineW = 200;
        ctx.beginPath();
        ctx.moveTo(CANVAS_WIDTH / 2 - lineW, titleY + 50);
        ctx.lineTo(CANVAS_WIDTH / 2 - 20, titleY + 50);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(CANVAS_WIDTH / 2 + 20, titleY + 50);
        ctx.lineTo(CANVAS_WIDTH / 2 + lineW, titleY + 50);
        ctx.stroke();
        // Diamond in center
        Renderer.polygon([
            [CANVAS_WIDTH / 2, titleY + 44],
            [CANVAS_WIDTH / 2 + 8, titleY + 50],
            [CANVAS_WIDTH / 2, titleY + 56],
            [CANVAS_WIDTH / 2 - 8, titleY + 50],
        ], COLORS.textGold);
 
        // Sword decorations flanking title
        this.drawMenuSword(ctx, CANVAS_WIDTH / 2 - 280, titleY - 30, -0.3);
        this.drawMenuSword(ctx, CANVAS_WIDTH / 2 + 280, titleY - 30, 0.3);
 
        // Buttons
        this.drawButton(ctx, CANVAS_WIDTH / 2, 400, 'BEGIN QUEST', time, 0);
        this.drawButton(ctx, CANVAS_WIDTH / 2, 455, 'CONTROLS', time, 1);
 
        // By Scoobert
        ctx.fillStyle = '#8a7a6a';
        ctx.font = '14px "Courier New", monospace';
        ctx.fillText('by Scoobert', CANVAS_WIDTH / 2, 530);
 
        // Version
        ctx.fillStyle = '#4a3a2a';
        ctx.font = '10px "Courier New", monospace';
        ctx.fillText('v1.0', CANVAS_WIDTH / 2, CANVAS_HEIGHT - 10);
 
        ctx.textAlign = 'left';
    },
 
    drawButton(ctx, x, y, text, time, index) {
        const w = 240;
        const h = 40;
        const bx = x - w / 2;
        const by = y - h / 2;
        const hover = Input.mouse.x > bx && Input.mouse.x < bx + w &&
            Input.mouse.y > by && Input.mouse.y < by + h;
 
        // Button background
        ctx.fillStyle = hover ? 'rgba(80,50,20,0.9)' : 'rgba(40,25,10,0.9)';
        ctx.fillRect(bx, by, w, h);
        ctx.strokeStyle = hover ? COLORS.textGold : COLORS.uiBorder;
        ctx.lineWidth = 2;
        ctx.strokeRect(bx, by, w, h);
 
        // Corner decorations
        const cs = 6;
        ctx.fillStyle = COLORS.textGold;
        ctx.fillRect(bx - 1, by - 1, cs, cs);
        ctx.fillRect(bx + w - cs + 1, by - 1, cs, cs);
        ctx.fillRect(bx - 1, by + h - cs + 1, cs, cs);
        ctx.fillRect(bx + w - cs + 1, by + h - cs + 1, cs, cs);
 
        // Text
        ctx.fillStyle = hover ? COLORS.textGold : COLORS.textWhite;
        ctx.font = 'bold 16px "Courier New", monospace';
        ctx.textAlign = 'center';
        ctx.fillText(text, x, y + 6);
    },
 
    drawMenuTorch(ctx, x, y, time) {
        // Bracket
        ctx.fillStyle = '#3a3a3a';
        ctx.fillRect(x - 2, y, 4, 12);
        // Flame
        const f1 = Math.sin(time * 0.008 + x) * 3;
        const f2 = Math.cos(time * 0.012 + y) * 2;
        ctx.fillStyle = '#ffcc00';
        ctx.beginPath();
        ctx.ellipse(x, y - 6 + f1, 6, 10, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ff8800';
        ctx.beginPath();
        ctx.ellipse(x, y - 4 + f1, 4, 7, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ff4400';
        ctx.beginPath();
        ctx.ellipse(x + f2, y - 2 + f1, 2, 4, 0, 0, Math.PI * 2);
        ctx.fill();
        // Glow
        const grd = ctx.createRadialGradient(x, y + f1, 0, x, y + f1, 60);
        grd.addColorStop(0, 'rgba(255,150,30,0.1)');
        grd.addColorStop(1, 'rgba(255,150,30,0)');
        ctx.fillStyle = grd;
        ctx.fillRect(x - 60, y - 60, 120, 120);
    },
 
    drawMenuSword(ctx, x, y, angle) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        // Blade
        ctx.fillStyle = '#c0c0c0';
        ctx.fillRect(-2, -40, 4, 60);
        // Point
        ctx.beginPath();
        ctx.moveTo(-3, -40);
        ctx.lineTo(0, -50);
        ctx.lineTo(3, -40);
        ctx.closePath();
        ctx.fill();
        // Guard
        ctx.fillStyle = '#8b4513';
        ctx.fillRect(-10, 18, 20, 4);
        // Grip
        ctx.fillStyle = '#5a3010';
        ctx.fillRect(-2, 22, 4, 15);
        // Pommel
        ctx.fillStyle = '#ffd700';
        ctx.beginPath();
        ctx.arc(0, 40, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    },
 
    drawControls(ctx, time) {
        ctx.fillStyle = 'rgba(10,5,20,0.95)';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
 
        // Panel
        const px = CANVAS_WIDTH / 2 - 280;
        const py = 40;
        ctx.fillStyle = COLORS.uiBg;
        ctx.fillRect(px, py, 560, 520);
        ctx.strokeStyle = COLORS.textGold;
        ctx.lineWidth = 2;
        ctx.strokeRect(px, py, 560, 520);
 
        ctx.textAlign = 'center';
        ctx.fillStyle = COLORS.textGold;
        ctx.font = 'bold 28px "Courier New", monospace';
        ctx.fillText('CONTROLS', CANVAS_WIDTH / 2, py + 40);
 
        const controls = [
            ['W / SPACE', 'Jump'],
            ['A / D', 'Move Left / Right'],
            ['SHIFT', 'Sprint (uses stamina)'],
            ['MOUSE', 'Aim'],
            ['LEFT CLICK', 'Attack'],
            ['1', 'Equip Sword'],
            ['2', 'Equip Bow'],
            ['Q / E', 'Switch Weapon'],
        ];
 
        ctx.font = '14px "Courier New", monospace';
        const startY = py + 80;
        for (let i = 0; i < controls.length; i++) {
            const cy = startY + i * 38;
            // Key
            ctx.fillStyle = '#333';
            ctx.fillRect(CANVAS_WIDTH / 2 - 220, cy - 12, 140, 28);
            ctx.strokeStyle = COLORS.uiBorder;
            ctx.strokeRect(CANVAS_WIDTH / 2 - 220, cy - 12, 140, 28);
            ctx.fillStyle = COLORS.textGold;
            ctx.textAlign = 'center';
            ctx.fillText(controls[i][0], CANVAS_WIDTH / 2 - 150, cy + 5);
            // Action
            ctx.fillStyle = COLORS.textWhite;
            ctx.textAlign = 'left';
            ctx.fillText(controls[i][1], CANVAS_WIDTH / 2 - 50, cy + 5);
        }
 
        // Tips
        ctx.textAlign = 'center';
        ctx.fillStyle = '#888';
        ctx.font = '12px "Courier New", monospace';
        ctx.fillText('Sword does more damage up close', CANVAS_WIDTH / 2, startY + controls.length * 38 + 20);
        ctx.fillText('Bow is great for keeping distance', CANVAS_WIDTH / 2, startY + controls.length * 38 + 40);
        ctx.fillText('Collect gems for bonus points', CANVAS_WIDTH / 2, startY + controls.length * 38 + 60);
        ctx.fillText('Beat par time for a time bonus!', CANVAS_WIDTH / 2, startY + controls.length * 38 + 80);
 
        // Back
        ctx.fillStyle = Math.sin(time * 0.05) > 0 ? COLORS.textGold : COLORS.textWhite;
        ctx.font = '16px "Courier New", monospace';
        ctx.fillText('Click anywhere to go back', CANVAS_WIDTH / 2, py + 500);
 
        ctx.textAlign = 'left';
    }
};