// ============================================================
// SWORDCERY - Overworld / Level Select
// Visual map showing unlocked levels in a line
// ============================================================
 
const Overworld = {
    unlockedLevels: 1, // Number of levels unlocked (starts at 1)
    selectedLevel: 0,
    scrollX: 0,
    targetScrollX: 0,
    highScores: [0, 0, 0, 0, 0, 0, 0, 0],
    bestRanks: ['', '', '', '', '', '', '', ''],
 
    init() {
        // Load saved progress if available
        try {
            const saved = localStorage.getItem('swordcery_progress');
            if (saved) {
                const data = JSON.parse(saved);
                this.unlockedLevels = data.unlockedLevels || 1;
                this.highScores = data.highScores || [0, 0, 0, 0, 0, 0, 0, 0];
                this.bestRanks = data.bestRanks || ['', '', '', '', '', '', '', ''];
            }
        } catch (e) {
            // Ignore load errors
        }
    },
 
    save() {
        try {
            localStorage.setItem('swordcery_progress', JSON.stringify({
                unlockedLevels: this.unlockedLevels,
                highScores: this.highScores,
                bestRanks: this.bestRanks,
            }));
        } catch (e) {
            // Ignore save errors
        }
    },
 
    unlockNext() {
        if (this.unlockedLevels < 8) {
            this.unlockedLevels++;
            this.save();
        }
    },
 
    updateHighScore(levelIndex, score) {
        if (score > this.highScores[levelIndex]) {
            this.highScores[levelIndex] = score;
            // Calculate rank
            const rank = score >= 3000 ? 'S' :
                score >= 2000 ? 'A' :
                    score >= 1200 ? 'B' :
                        score >= 600 ? 'C' : 'D';
            this.bestRanks[levelIndex] = rank;
            this.save();
        }
    },
 
    update(time) {
        // Scroll to selected level
        const nodeSpacing = 150;
        this.targetScrollX = this.selectedLevel * nodeSpacing - CANVAS_WIDTH / 2 + 200;
        this.targetScrollX = Math.max(0, Math.min(this.targetScrollX, 8 * nodeSpacing - CANVAS_WIDTH + 300));
        this.scrollX += (this.targetScrollX - this.scrollX) * 0.1;
 
        // Click detection
        if (Input.mouse.clicked) {
            const mx = Input.mouse.x;
            const my = Input.mouse.y;
 
            for (let i = 0; i < 8; i++) {
                const nx = 200 + i * nodeSpacing - this.scrollX;
                const ny = 350;
                if (mx > nx - 30 && mx < nx + 30 && my > ny - 30 && my < ny + 30) {
                    if (i < this.unlockedLevels) {
                        this.selectedLevel = i;
                        Input.clearClick();
                        return i; // Return level index to start
                    }
                }
            }
 
            // Back button
            if (mx > 20 && mx < 120 && my > 20 && my < 55) {
                Input.clearClick();
                return 'back';
            }
 
            Input.clearClick();
        }
        return null;
    },
 
    draw(ctx, time) {
        // Background
        const grad = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
        grad.addColorStop(0, '#0a0520');
        grad.addColorStop(0.5, '#1a0a3a');
        grad.addColorStop(1, '#0a0510');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
 
        // Stars
        for (let i = 0; i < 40; i++) {
            const sx = (i * 137 + 42) % CANVAS_WIDTH;
            const sy = (i * 91 + 42) % (CANVAS_HEIGHT * 0.4);
            const alpha = 0.3 + Math.sin(time * 0.002 + i) * 0.3;
            ctx.fillStyle = `rgba(255,255,220,${Math.max(0, alpha)})`;
            ctx.fillRect(sx, sy, 1 + (i % 2), 1 + (i % 2));
        }
 
        // Title
        ctx.fillStyle = COLORS.textGold;
        ctx.font = 'bold 32px "Courier New", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('CHOOSE YOUR QUEST', CANVAS_WIDTH / 2, 60);
 
        // Decorative line
        ctx.strokeStyle = COLORS.uiBorder;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(CANVAS_WIDTH / 2 - 200, 75);
        ctx.lineTo(CANVAS_WIDTH / 2 + 200, 75);
        ctx.stroke();
 
        // Path line
        const nodeSpacing = 150;
        const pathY = 350;
        ctx.strokeStyle = '#3a2a1a';
        ctx.lineWidth = 4;
        ctx.setLineDash([8, 4]);
        ctx.beginPath();
        ctx.moveTo(200 - this.scrollX, pathY);
        ctx.lineTo(200 + 7 * nodeSpacing - this.scrollX, pathY);
        ctx.stroke();
        ctx.setLineDash([]);
 
        // Draw connecting path with progress
        ctx.strokeStyle = COLORS.textGold;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(200 - this.scrollX, pathY);
        ctx.lineTo(200 + (this.unlockedLevels - 1) * nodeSpacing - this.scrollX, pathY);
        ctx.stroke();
 
        // Level nodes
        for (let i = 0; i < 8; i++) {
            const nx = 200 + i * nodeSpacing - this.scrollX;
            const ny = pathY;
            const unlocked = i < this.unlockedLevels;
            const selected = i === this.selectedLevel;
            const hover = Input.mouse.x > nx - 30 && Input.mouse.x < nx + 30 &&
                Input.mouse.y > ny - 30 && Input.mouse.y < ny + 30;
 
            // Node background
            if (unlocked) {
                // Glow for selected/hover
                if (selected || hover) {
                    const glow = ctx.createRadialGradient(nx, ny, 0, nx, ny, 50);
                    glow.addColorStop(0, 'rgba(255,215,0,0.2)');
                    glow.addColorStop(1, 'rgba(255,215,0,0)');
                    ctx.fillStyle = glow;
                    ctx.beginPath();
                    ctx.arc(nx, ny, 50, 0, Math.PI * 2);
                    ctx.fill();
                }
 
                // Castle icon for each level
                this.drawLevelIcon(ctx, nx, ny, i, time);
 
                // Level number
                ctx.fillStyle = selected ? COLORS.textGold : COLORS.textWhite;
                ctx.font = 'bold 18px "Courier New", monospace';
                ctx.textAlign = 'center';
                ctx.fillText((i + 1).toString(), nx, ny + 6);
            } else {
                // Locked
                ctx.fillStyle = '#2a2a2a';
                ctx.beginPath();
                ctx.arc(nx, ny, 22, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = '#444';
                ctx.lineWidth = 2;
                ctx.stroke();
 
                // Lock icon
                ctx.fillStyle = '#555';
                ctx.fillRect(nx - 6, ny - 2, 12, 10);
                ctx.strokeStyle = '#555';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(nx, ny - 5, 5, Math.PI, 0);
                ctx.stroke();
            }
 
            // Level name below
            if (unlocked) {
                ctx.fillStyle = selected ? COLORS.textGold : '#999';
                ctx.font = '10px "Courier New", monospace';
                ctx.textAlign = 'center';
                ctx.fillText(LEVEL_NAMES[i], nx, ny + 45);
 
                // High score
                if (this.highScores[i] > 0) {
                    ctx.fillStyle = '#888';
                    ctx.font = '9px "Courier New", monospace';
                    ctx.fillText(`Best: ${this.highScores[i]}`, nx, ny + 57);
                    // Rank
                    if (this.bestRanks[i]) {
                        const rankColor = this.bestRanks[i] === 'S' ? '#ffd700' :
                            this.bestRanks[i] === 'A' ? '#00ff7f' :
                                this.bestRanks[i] === 'B' ? '#4488ff' :
                                    this.bestRanks[i] === 'C' ? '#fff' : '#888';
                        ctx.fillStyle = rankColor;
                        ctx.font = 'bold 12px "Courier New", monospace';
                        ctx.fillText(this.bestRanks[i], nx, ny + 70);
                    }
                }
            }
        }
 
        // Selected level info panel
        if (this.selectedLevel < this.unlockedLevels) {
            const panelY = 470;
            ctx.fillStyle = COLORS.uiBg;
            ctx.fillRect(CANVAS_WIDTH / 2 - 250, panelY, 500, 120);
            ctx.strokeStyle = COLORS.uiBorder;
            ctx.lineWidth = 2;
            ctx.strokeRect(CANVAS_WIDTH / 2 - 250, panelY, 500, 120);
 
            ctx.fillStyle = COLORS.textGold;
            ctx.font = 'bold 18px "Courier New", monospace';
            ctx.textAlign = 'center';
            ctx.fillText(`${this.selectedLevel + 1}. ${LEVEL_NAMES[this.selectedLevel]}`, CANVAS_WIDTH / 2, panelY + 28);
 
            ctx.fillStyle = '#aaa';
            ctx.font = '12px "Courier New", monospace';
            ctx.fillText(LEVEL_DESCRIPTIONS[this.selectedLevel], CANVAS_WIDTH / 2, panelY + 52);
 
            // Click to play
            ctx.fillStyle = Math.sin(time * 0.005) > 0 ? COLORS.textGold : COLORS.textWhite;
            ctx.font = 'bold 14px "Courier New", monospace';
            ctx.fillText('~ Click level node to play ~', CANVAS_WIDTH / 2, panelY + 90);
 
            // High score display
            if (this.highScores[this.selectedLevel] > 0) {
                ctx.fillStyle = '#888';
                ctx.font = '11px "Courier New", monospace';
                ctx.fillText(`High Score: ${this.highScores[this.selectedLevel]}`, CANVAS_WIDTH / 2, panelY + 108);
            }
        }
 
        // Navigation hints
        ctx.fillStyle = '#666';
        ctx.font = '11px "Courier New", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('Click a level to begin', CANVAS_WIDTH / 2, CANVAS_HEIGHT - 20);
 
        // Back button
        ctx.fillStyle = Input.mouse.x > 20 && Input.mouse.x < 120 &&
            Input.mouse.y > 20 && Input.mouse.y < 55 ? 'rgba(60,40,20,0.9)' : 'rgba(30,20,10,0.9)';
        ctx.fillRect(20, 20, 100, 35);
        ctx.strokeStyle = COLORS.uiBorder;
        ctx.lineWidth = 1;
        ctx.strokeRect(20, 20, 100, 35);
        ctx.fillStyle = COLORS.textWhite;
        ctx.font = '12px "Courier New", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('< BACK', 70, 42);
 
        ctx.textAlign = 'left';
    },
 
    drawLevelIcon(ctx, x, y, levelIndex, time) {
        const pulse = Math.sin(time * 0.003 + levelIndex) * 2;
 
        // Circle base
        ctx.fillStyle = levelIndex === 7 ? '#3d0000' :
            levelIndex >= 5 ? '#2d0044' :
                levelIndex >= 3 ? '#1a2a1a' : '#2a1a0a';
        ctx.beginPath();
        ctx.arc(x, y, 24 + pulse, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = COLORS.textGold;
        ctx.lineWidth = 2;
        ctx.stroke();
 
        // Inner border
        ctx.strokeStyle = 'rgba(255,215,0,0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, Math.PI * 2);
        ctx.stroke();
    }
};