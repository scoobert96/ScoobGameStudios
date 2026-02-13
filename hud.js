// ============================================================
// SWORDCERY - HUD (Heads-Up Display)
// Health bar, stamina bar, minimap, score, weapon display
// ============================================================
 
const HUD = {
    draw(ctx, player, score, levelData, camera, time, enemies) {
        // Health bar
        this.drawBar(ctx, 20, 20, 180, 18, player.health, player.maxHealth,
            COLORS.healthRed, COLORS.healthBg, 'HP');
 
        // Stamina bar
        this.drawBar(ctx, 20, 46, 180, 14, player.stamina, player.maxStamina,
            COLORS.staminaGold, COLORS.staminaBg, 'ST');
 
        // Score
        ctx.fillStyle = COLORS.uiBg;
        ctx.fillRect(CANVAS_WIDTH - 180, 15, 165, 35);
        ctx.strokeStyle = COLORS.uiBorder;
        ctx.lineWidth = 2;
        ctx.strokeRect(CANVAS_WIDTH - 180, 15, 165, 35);
        ctx.fillStyle = COLORS.textGold;
        ctx.font = 'bold 14px "Courier New", monospace';
        ctx.textAlign = 'right';
        ctx.fillText('SCORE', CANVAS_WIDTH - 30, 32);
        ctx.font = 'bold 18px "Courier New", monospace';
        ctx.fillText(score.toString().padStart(7, '0'), CANVAS_WIDTH - 30, 48);
        ctx.textAlign = 'left';
 
        // Weapon indicator
        this.drawWeaponIndicator(ctx, player, time);
 
        // Minimap
        this.drawMinimap(ctx, player, levelData, camera, enemies);
 
        // Crosshair
        this.drawCrosshair(ctx, time);
    },
 
    drawBar(ctx, x, y, w, h, current, max, color, bgColor, label) {
        // Background
        ctx.fillStyle = COLORS.uiBg;
        ctx.fillRect(x - 2, y - 2, w + 4, h + 4);
        ctx.strokeStyle = COLORS.uiBorder;
        ctx.lineWidth = 1;
        ctx.strokeRect(x - 2, y - 2, w + 4, h + 4);
 
        // Bar background
        ctx.fillStyle = bgColor;
        ctx.fillRect(x, y, w, h);
 
        // Bar fill
        const fillW = (current / max) * w;
        const grad = ctx.createLinearGradient(x, y, x, y + h);
        grad.addColorStop(0, color);
        grad.addColorStop(1, this.darken(color));
        ctx.fillStyle = grad;
        ctx.fillRect(x, y, fillW, h);
 
        // Shine effect
        ctx.fillStyle = 'rgba(255,255,255,0.15)';
        ctx.fillRect(x, y, fillW, h / 3);
 
        // Label
        ctx.fillStyle = COLORS.textWhite;
        ctx.font = 'bold 10px "Courier New", monospace';
        ctx.textAlign = 'left';
        ctx.fillText(label, x + 4, y + h - 4);
 
        // Value text
        ctx.textAlign = 'right';
        ctx.fillText(`${Math.ceil(current)}/${max}`, x + w - 4, y + h - 4);
        ctx.textAlign = 'left';
    },
 
    drawWeaponIndicator(ctx, player, time) {
        const x = 20;
        const y = 72;
        const size = 45;
 
        ctx.fillStyle = COLORS.uiBg;
        ctx.fillRect(x, y, size, size);
        ctx.strokeStyle = player.weapon === 'sword' ? '#ff8844' : '#44aaff';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, size, size);
 
        // Draw weapon icon
        WeaponData[player.weapon].icon(ctx, x + size / 2, y + size / 2, size * 0.3);
 
        // Weapon name
        ctx.fillStyle = COLORS.textWhite;
        ctx.font = '9px "Courier New", monospace';
        ctx.textAlign = 'center';
        ctx.fillText(player.weapon === 'sword' ? '[1] SWORD' : '[2] BOW', x + size / 2, y + size + 12);
        ctx.textAlign = 'left';
 
        // Cooldown overlay
        if (player.attackCooldown > 0) {
            const cooldownMax = player.weapon === 'sword' ? player.swordCooldown : player.bowCooldown;
            const ratio = player.attackCooldown / cooldownMax;
            ctx.fillStyle = 'rgba(0,0,0,0.5)';
            ctx.fillRect(x, y + size * (1 - ratio), size, size * ratio);
        }
 
        // Q/E hint
        ctx.fillStyle = COLORS.textWhite;
        ctx.font = '8px "Courier New", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('[Q/E] Switch', x + size / 2, y + size + 22);
        ctx.textAlign = 'left';
    },
 
    drawMinimap(ctx, player, levelData, camera, enemies) {
        const mapW = 180;
        const mapH = 50;
        const mapX = CANVAS_WIDTH - mapW - 15;
        const mapY = CANVAS_HEIGHT - mapH - 15;
        const scaleX = mapW / levelData.width;
        const scaleY = mapH / levelData.height;
 
        // Background
        ctx.fillStyle = 'rgba(10,10,20,0.85)';
        ctx.fillRect(mapX - 2, mapY - 2, mapW + 4, mapH + 4);
        ctx.strokeStyle = COLORS.uiBorder;
        ctx.lineWidth = 1;
        ctx.strokeRect(mapX - 2, mapY - 2, mapW + 4, mapH + 4);
 
        // Label
        ctx.fillStyle = COLORS.textGold;
        ctx.font = '8px "Courier New", monospace';
        ctx.fillText('MAP', mapX + 2, mapY - 5);
 
        // Platforms
        ctx.fillStyle = 'rgba(100,100,80,0.6)';
        for (const p of levelData.platforms) {
            ctx.fillRect(
                mapX + p.x * scaleX,
                mapY + p.y * scaleY,
                Math.max(2, p.w * scaleX),
                Math.max(1, p.h * scaleY)
            );
        }
 
        // Enemies
        for (const e of enemies) {
            if (!e.alive) continue;
            ctx.fillStyle = e.type === 'troll' ? '#ff4444' :
                e.type === 'witch' ? '#ff44ff' :
                    e.type === 'boss_necromancer' ? '#ff0000' : '#ff8844';
            ctx.fillRect(
                mapX + e.x * scaleX - 1,
                mapY + e.y * scaleY - 1,
                3, 3
            );
        }
 
        // Exit
        ctx.fillStyle = '#00ff00';
        ctx.fillRect(
            mapX + levelData.exitX * scaleX - 2,
            mapY + levelData.exitY * scaleY - 2,
            4, 4
        );
 
        // Player
        ctx.fillStyle = '#4488ff';
        ctx.fillRect(
            mapX + player.x * scaleX - 2,
            mapY + player.y * scaleY - 2,
            4, 4
        );
 
        // Camera viewport
        ctx.strokeStyle = 'rgba(255,255,255,0.3)';
        ctx.strokeRect(
            mapX + camera.x * scaleX,
            mapY + camera.y * scaleY,
            CANVAS_WIDTH * scaleX,
            CANVAS_HEIGHT * scaleY
        );
    },
 
    drawCrosshair(ctx, time) {
        const mx = Input.mouse.x;
        const my = Input.mouse.y;
        const pulse = Math.sin(time * 0.05) * 2;
 
        ctx.strokeStyle = 'rgba(255,255,255,0.7)';
        ctx.lineWidth = 1;
        const size = 8 + pulse;
 
        ctx.beginPath();
        ctx.moveTo(mx - size, my);
        ctx.lineTo(mx - 3, my);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(mx + 3, my);
        ctx.lineTo(mx + size, my);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(mx, my - size);
        ctx.lineTo(mx, my - 3);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(mx, my + 3);
        ctx.lineTo(mx, my + size);
        ctx.stroke();
 
        // Center dot
        ctx.fillStyle = 'rgba(255,200,100,0.8)';
        ctx.fillRect(mx - 1, my - 1, 2, 2);
    },
 
    drawLevelComplete(ctx, score, levelScore, time, parTime, completionTime, enemiesKilled, totalEnemies) {
        // Overlay
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
 
        // Panel
        const px = CANVAS_WIDTH / 2 - 200;
        const py = 120;
        ctx.fillStyle = COLORS.uiBg;
        ctx.fillRect(px, py, 400, 360);
        ctx.strokeStyle = COLORS.textGold;
        ctx.lineWidth = 3;
        ctx.strokeRect(px, py, 400, 360);
 
        // Title
        ctx.fillStyle = COLORS.textGold;
        ctx.font = 'bold 28px "Courier New", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('LEVEL COMPLETE!', CANVAS_WIDTH / 2, py + 45);
 
        // Stats
        ctx.font = '16px "Courier New", monospace';
        ctx.fillStyle = COLORS.textWhite;
        const statsY = py + 85;
        const lineH = 30;
 
        ctx.textAlign = 'left';
        ctx.fillText('Enemies Slain:', px + 30, statsY);
        ctx.textAlign = 'right';
        ctx.fillStyle = COLORS.textGold;
        ctx.fillText(`${enemiesKilled} / ${totalEnemies}`, px + 370, statsY);
 
        ctx.textAlign = 'left';
        ctx.fillStyle = COLORS.textWhite;
        ctx.fillText('Time:', px + 30, statsY + lineH);
        ctx.textAlign = 'right';
        const timeStr = formatTime(completionTime);
        const parStr = formatTime(parTime);
        const underPar = completionTime <= parTime;
        ctx.fillStyle = underPar ? COLORS.healGreen : COLORS.textWhite;
        ctx.fillText(`${timeStr} (Par: ${parStr})`, px + 370, statsY + lineH);
 
        // Time bonus
        ctx.textAlign = 'left';
        ctx.fillStyle = COLORS.textWhite;
        ctx.fillText('Time Bonus:', px + 30, statsY + lineH * 2);
        ctx.textAlign = 'right';
        const timeBonus = underPar ? Math.floor((parTime - completionTime) / 60) * 10 : 0;
        ctx.fillStyle = COLORS.textGold;
        ctx.fillText(`+${timeBonus}`, px + 370, statsY + lineH * 2);
 
        // Kill bonus
        ctx.textAlign = 'left';
        ctx.fillStyle = COLORS.textWhite;
        ctx.fillText('Kill Bonus:', px + 30, statsY + lineH * 3);
        ctx.textAlign = 'right';
        const killBonus = enemiesKilled === totalEnemies ? 500 : 0;
        ctx.fillStyle = COLORS.textGold;
        ctx.fillText(killBonus > 0 ? `+${killBonus} (ALL SLAIN!)` : '+0', px + 370, statsY + lineH * 3);
 
        // Level score
        ctx.textAlign = 'left';
        ctx.fillStyle = COLORS.textWhite;
        ctx.fillText('Level Score:', px + 30, statsY + lineH * 4);
        ctx.textAlign = 'right';
        ctx.fillStyle = COLORS.textGold;
        ctx.font = 'bold 18px "Courier New", monospace';
        ctx.fillText((levelScore + timeBonus + killBonus).toString(), px + 370, statsY + lineH * 4);
 
        // Rank
        const totalLevelScore = levelScore + timeBonus + killBonus;
        const rank = totalLevelScore >= 3000 ? 'S' :
            totalLevelScore >= 2000 ? 'A' :
                totalLevelScore >= 1200 ? 'B' :
                    totalLevelScore >= 600 ? 'C' : 'D';
        const rankColor = rank === 'S' ? '#ffd700' :
            rank === 'A' ? '#00ff7f' :
                rank === 'B' ? '#4488ff' :
                    rank === 'C' ? '#fff' : '#888';
 
        ctx.font = 'bold 48px "Courier New", monospace';
        ctx.fillStyle = rankColor;
        ctx.textAlign = 'center';
        ctx.fillText(`RANK: ${rank}`, CANVAS_WIDTH / 2, statsY + lineH * 6);
 
        // Total score
        ctx.font = '14px "Courier New", monospace';
        ctx.fillStyle = COLORS.textWhite;
        ctx.fillText(`Total Score: ${score}`, CANVAS_WIDTH / 2, statsY + lineH * 7 + 10);
 
        // Continue prompt
        ctx.font = '14px "Courier New", monospace';
        ctx.fillStyle = Math.sin(time * 0.05) > 0 ? COLORS.textGold : COLORS.textWhite;
        ctx.fillText('Click to continue...', CANVAS_WIDTH / 2, statsY + lineH * 8 + 15);
 
        ctx.textAlign = 'left';
    },
 
    drawGameOver(ctx, score, time) {
        ctx.fillStyle = 'rgba(20,0,0,0.8)';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
 
        ctx.fillStyle = COLORS.healthRed;
        ctx.font = 'bold 48px "Courier New", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('YOU DIED', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 40);
 
        ctx.fillStyle = COLORS.textWhite;
        ctx.font = '16px "Courier New", monospace';
        ctx.fillText(`Score: ${score}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 10);
 
        ctx.fillStyle = Math.sin(time * 0.05) > 0 ? COLORS.textGold : COLORS.textWhite;
        ctx.font = '14px "Courier New", monospace';
        ctx.fillText('Click to retry...', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 50);
 
        ctx.textAlign = 'left';
    },
 
    darken(color) {
        // Simple darken for gradient
        return color;
    }
};
 
function formatTime(frames) {
    const totalSec = Math.floor(frames / 60);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
}