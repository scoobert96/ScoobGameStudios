// ============================================================
// SWORDCERY - Main Game Loop
// by Scoobert
// Game state management, main loop, collision handling
// ============================================================
 
const Game = {
    canvas: null,
    ctx: null,
    state: 'menu', // 'menu', 'controls', 'overworld', 'playing', 'levelComplete', 'gameOver'
    time: 0,
    player: null,
    camera: null,
    particles: null,
    currentLevel: null,
    currentLevelIndex: 0,
    score: 0,
    levelScore: 0,
    levelTime: 0,
    totalEnemies: 0,
    enemiesKilled: 0,
 
    init() {
        this.canvas = document.getElementById('gameCanvas');
        this.canvas.width = CANVAS_WIDTH;
        this.canvas.height = CANVAS_HEIGHT;
        this.ctx = this.canvas.getContext('2d');
        this.ctx.imageSmoothingEnabled = false;
 
        Input.init(this.canvas);
        Renderer.init(this.ctx);
        MainMenu.init();
        Overworld.init();
 
        this.camera = new Camera();
        this.particles = new ParticleSystem();
 
        // Start game loop
        this.loop();
    },
 
    loop() {
        this.time++;
        this.update();
        this.draw();
        Input.clearClick();
        requestAnimationFrame(() => this.loop());
    },
 
    update() {
        switch (this.state) {
            case 'menu':
                const menuResult = MainMenu.update(this.time);
                if (menuResult === 'start') {
                    this.state = 'overworld';
                } else if (menuResult === 'controls') {
                    this.state = 'controls';
                }
                break;
 
            case 'controls':
                if (Input.mouse.clicked) {
                    this.state = 'menu';
                    Input.clearClick();
                }
                break;
 
            case 'overworld':
                const owResult = Overworld.update(this.time);
                if (owResult === 'back') {
                    this.state = 'menu';
                } else if (typeof owResult === 'number') {
                    this.startLevel(owResult);
                }
                break;
 
            case 'playing':
                this.updateGameplay();
                break;
 
            case 'levelComplete':
                if (Input.mouse.clicked) {
                    this.state = 'overworld';
                    Input.clearClick();
                }
                break;
 
            case 'gameOver':
                if (Input.mouse.clicked) {
                    // Retry level
                    this.startLevel(this.currentLevelIndex);
                    Input.clearClick();
                }
                break;
        }
    },
 
    startLevel(levelIndex) {
        this.currentLevelIndex = levelIndex;
        this.currentLevel = generateLevel(levelIndex);
        this.player = new Player(this.currentLevel.spawnX, this.currentLevel.spawnY);
        this.camera = new Camera();
        this.particles.clear();
        this.levelScore = 0;
        this.levelTime = 0;
        this.totalEnemies = this.currentLevel.enemies.length;
        this.enemiesKilled = 0;
        this.state = 'playing';
 
        // Center camera on player immediately
        this.camera.x = this.player.x - CANVAS_WIDTH / 2;
        this.camera.y = this.player.y - CANVAS_HEIGHT / 2;
    },
 
    updateGameplay() {
        const level = this.currentLevel;
        const player = this.player;
 
        this.levelTime++;
 
        // Update player
        player.update(level.platforms, this.camera);
 
        // Update camera
        this.camera.follow(player, level.width, level.height);
 
        // Update enemies
        for (const enemy of level.enemies) {
            enemy.update(player, level.platforms);
        }
 
        // Update pickups
        for (const p of level.pickups) p.update();
        for (const g of level.gems) g.update();
 
        // Update particles
        this.particles.update();
 
        // === COLLISION DETECTION ===
 
        // Player sword vs enemies
        const swordHit = player.getSwordHitbox();
        if (swordHit) {
            for (const enemy of level.enemies) {
                if (!enemy.alive) continue;
                if (rectsOverlap(swordHit, enemy)) {
                    enemy.takeDamage(swordHit.damage);
                    this.particles.emit(
                        enemy.x + enemy.w / 2, enemy.y + enemy.h / 2,
                        8, [COLORS.sparkYellow, COLORS.sparkOrange, COLORS.hitWhite],
                        [1, 4], [10, 25], [2, 5]
                    );
                    this.camera.shake(4);
                    if (!enemy.alive) {
                        this.enemiesKilled++;
                        this.levelScore += enemy.scoreValue;
                        this.score += enemy.scoreValue;
                        this.particles.emit(
                            enemy.x + enemy.w / 2, enemy.y + enemy.h / 2,
                            15, ['#fff', '#ddd', '#bbb', COLORS.skeletonWhite],
                            [2, 6], [20, 40], [2, 6]
                        );
                    }
                }
            }
        }
 
        // Player arrows vs enemies
        for (let ai = player.arrows.length - 1; ai >= 0; ai--) {
            const arrow = player.arrows[ai];
            for (const enemy of level.enemies) {
                if (!enemy.alive) continue;
                if (arrow.x > enemy.x && arrow.x < enemy.x + enemy.w &&
                    arrow.y > enemy.y && arrow.y < enemy.y + enemy.h) {
                    enemy.takeDamage(arrow.damage);
                    player.arrows.splice(ai, 1);
                    this.particles.emit(
                        arrow.x, arrow.y,
                        6, [COLORS.sparkYellow, COLORS.arrowWood],
                        [1, 3], [10, 20], [2, 4]
                    );
                    this.camera.shake(2);
                    if (!enemy.alive) {
                        this.enemiesKilled++;
                        this.levelScore += enemy.scoreValue;
                        this.score += enemy.scoreValue;
                        this.particles.emit(
                            enemy.x + enemy.w / 2, enemy.y + enemy.h / 2,
                            15, ['#fff', '#ddd', '#bbb'],
                            [2, 6], [20, 40], [2, 6]
                        );
                    }
                    break;
                }
            }
        }
 
        // Enemy attacks vs player
        for (const enemy of level.enemies) {
            if (!enemy.alive) continue;
 
            // Melee attack hitbox
            const atkHit = enemy.getAttackHitbox();
            if (atkHit && rectsOverlap(atkHit, player)) {
                player.takeDamage(atkHit.damage);
                player.knockback(enemy.x + enemy.w / 2, enemy.y + enemy.h / 2, 5);
                this.camera.shake(5);
                this.particles.emit(
                    player.x + player.w / 2, player.y + player.h / 2,
                    6, [COLORS.healthRed, '#ff6666'],
                    [1, 3], [10, 20], [2, 4]
                );
            }
 
            // Contact damage
            if (rectsOverlap(player, enemy) && player.invincible <= 0) {
                player.takeDamage(enemy.damage * 0.5);
                player.knockback(enemy.x + enemy.w / 2, enemy.y + enemy.h / 2, 4);
                this.camera.shake(3);
            }
 
            // Enemy projectiles vs player
            for (let pi = enemy.projectiles.length - 1; pi >= 0; pi--) {
                const proj = enemy.projectiles[pi];
                if (proj.x > player.x && proj.x < player.x + player.w &&
                    proj.y > player.y && proj.y < player.y + player.h) {
                    player.takeDamage(proj.damage);
                    player.knockback(proj.x, proj.y, 3);
                    enemy.projectiles.splice(pi, 1);
                    this.camera.shake(3);
                    this.particles.emit(
                        player.x + player.w / 2, player.y + player.h / 2,
                        5, [COLORS.healthRed, '#ff6666'],
                        [1, 3], [10, 15], [2, 4]
                    );
                }
            }
        }
 
        // Player vs pickups
        for (const pickup of level.pickups) {
            if (!pickup.active) continue;
            if (rectsOverlap(player, pickup)) {
                pickup.active = false;
                if (pickup instanceof HealthPickup) {
                    player.health = Math.min(player.maxHealth, player.health + pickup.healAmount);
                    this.particles.emit(
                        player.x + player.w / 2, player.y + player.h / 2,
                        10, [COLORS.healGreen, '#88ff88'],
                        [1, 3], [15, 30], [2, 4]
                    );
                } else if (pickup instanceof StaminaPickup) {
                    player.stamina = Math.min(player.maxStamina, player.stamina + pickup.amount);
                    this.particles.emit(
                        player.x + player.w / 2, player.y + player.h / 2,
                        10, [COLORS.staminaGold, '#ffff88'],
                        [1, 3], [15, 30], [2, 4]
                    );
                }
            }
        }
 
        // Player vs gems
        for (const gem of level.gems) {
            if (!gem.active) continue;
            if (rectsOverlap(player, gem)) {
                gem.active = false;
                this.levelScore += gem.value;
                this.score += gem.value;
                this.particles.emit(
                    gem.x + gem.w / 2, gem.y + gem.h / 2,
                    8, [gem.color, '#fff', COLORS.sparkYellow],
                    [1, 4], [15, 30], [2, 5]
                );
            }
        }
 
        // Check exit
        if (player.alive) {
            const exitDist = dist(
                player.x + player.w / 2, player.y + player.h / 2,
                level.exitX, level.exitY
            );
            if (exitDist < 50) {
                this.completeLevel();
            }
        }
 
        // Check death
        if (!player.alive && player.deathTimer > 90) {
            this.state = 'gameOver';
        }
    },
 
    completeLevel() {
        this.state = 'levelComplete';
        // Calculate total level score with bonuses
        const parTime = this.currentLevel.par;
        const underPar = this.levelTime <= parTime;
        const timeBonus = underPar ? Math.floor((parTime - this.levelTime) / 60) * 10 : 0;
        const killBonus = this.enemiesKilled === this.totalEnemies ? 500 : 0;
        const totalLevelScore = this.levelScore + timeBonus + killBonus;
        this.score += timeBonus + killBonus;
 
        // Update high scores
        Overworld.updateHighScore(this.currentLevelIndex, totalLevelScore);
 
        // Unlock next level
        if (this.currentLevelIndex + 1 >= Overworld.unlockedLevels) {
            Overworld.unlockNext();
        }
        Overworld.selectedLevel = Math.min(this.currentLevelIndex + 1, 7);
    },
 
    draw() {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
 
        switch (this.state) {
            case 'menu':
                MainMenu.draw(ctx, this.time);
                break;
 
            case 'controls':
                MainMenu.draw(ctx, this.time);
                MainMenu.drawControls(ctx, this.time);
                break;
 
            case 'overworld':
                Overworld.draw(ctx, this.time);
                break;
 
            case 'playing':
            case 'levelComplete':
            case 'gameOver':
                this.drawGameplay(ctx);
                break;
        }
    },
 
    drawGameplay(ctx) {
        const level = this.currentLevel;
        const ox = this.camera.getOffX();
        const oy = this.camera.getOffY();
 
        // Sky
        Renderer.drawSky(this.camera, level.width);
 
        // Background
        Renderer.drawBgCastles(this.camera, level.width);
 
        // Torches (behind platforms)
        for (const t of level.torches) {
            Renderer.drawTorch(t.x, t.y, ox, oy, this.time);
        }
 
        // Draw platforms
        for (const p of level.platforms) {
            // Only draw if on screen
            if (p.x + ox + p.w < -50 || p.x + ox > CANVAS_WIDTH + 50) continue;
            if (p.y + oy + p.h < -50 || p.y + oy > CANVAS_HEIGHT + 50) continue;
 
            switch (p.style) {
                case 'stone':
                    Renderer.stoneBlock(p.x, p.y, p.w, p.h, ox, oy, Math.floor(p.x / 100));
                    break;
                case 'wood':
                    Renderer.woodPlatform(p.x, p.y, p.w, p.h, ox, oy);
                    break;
                case 'fortress':
                    Renderer.fortressWall(p.x, p.y, p.w, p.h, ox, oy);
                    break;
            }
        }
 
        // Draw exit portal
        this.drawExit(ctx, level.exitX, level.exitY, ox, oy);
 
        // Draw pickups
        for (const p of level.pickups) p.draw(ctx, ox, oy);
        for (const g of level.gems) g.draw(ctx, ox, oy);
 
        // Draw enemies
        for (const enemy of level.enemies) {
            enemy.draw(ctx, ox, oy, this.time);
            enemy.drawProjectiles(ctx, ox, oy, this.time);
        }
 
        // Draw player
        this.player.draw(ctx, ox, oy, this.time);
        this.player.drawArrows(ctx, ox, oy);
 
        // Draw particles
        this.particles.draw(ctx, ox, oy);
 
        // Draw HUD
        HUD.draw(ctx, this.player, this.score, level, this.camera, this.time, level.enemies);
 
        // Level name display (first 3 seconds)
        if (this.levelTime < 180) {
            const alpha = this.levelTime < 120 ? 1 : (180 - this.levelTime) / 60;
            ctx.globalAlpha = alpha;
            ctx.fillStyle = COLORS.textGold;
            ctx.font = 'bold 28px "Courier New", monospace';
            ctx.textAlign = 'center';
            ctx.fillText(LEVEL_NAMES[this.currentLevelIndex], CANVAS_WIDTH / 2, 120);
            ctx.font = '14px "Courier New", monospace';
            ctx.fillStyle = COLORS.textWhite;
            ctx.fillText(LEVEL_DESCRIPTIONS[this.currentLevelIndex], CANVAS_WIDTH / 2, 150);
            ctx.globalAlpha = 1;
            ctx.textAlign = 'left';
        }
 
        // Timer display
        ctx.fillStyle = COLORS.textWhite;
        ctx.font = '12px "Courier New", monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`Time: ${formatTime(this.levelTime)}`, CANVAS_WIDTH / 2, 30);
        ctx.textAlign = 'left';
 
        // Overlays
        if (this.state === 'levelComplete') {
            HUD.drawLevelComplete(ctx, this.score, this.levelScore, this.time,
                this.currentLevel.par, this.levelTime,
                this.enemiesKilled, this.totalEnemies);
        }
        if (this.state === 'gameOver') {
            HUD.drawGameOver(ctx, this.score, this.time);
        }
    },
 
    drawExit(ctx, ex, ey, ox, oy) {
        const dx = ex + ox;
        const dy = ey + oy;
 
        // Portal glow
        const grd = ctx.createRadialGradient(dx, dy, 0, dx, dy, 40);
        grd.addColorStop(0, 'rgba(0,255,128,0.3)');
        grd.addColorStop(0.5, 'rgba(0,200,100,0.15)');
        grd.addColorStop(1, 'rgba(0,255,128,0)');
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(dx, dy, 40, 0, Math.PI * 2);
        ctx.fill();
 
        // Portal ring
        ctx.strokeStyle = COLORS.healGreen;
        ctx.lineWidth = 3;
        ctx.beginPath();
        const pulse = Math.sin(this.time * 0.05) * 3;
        ctx.arc(dx, dy, 18 + pulse, 0, Math.PI * 2);
        ctx.stroke();
 
        // Inner ring
        ctx.strokeStyle = '#88ffaa';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(dx, dy, 10 + pulse * 0.5, 0, Math.PI * 2);
        ctx.stroke();
 
        // Arrow indicator
        ctx.fillStyle = COLORS.healGreen;
        ctx.font = 'bold 12px "Courier New", monospace';
        ctx.textAlign = 'center';
        const bob = Math.sin(this.time * 0.04) * 3;
        ctx.fillText('EXIT', dx, dy - 30 + bob);
        ctx.textAlign = 'left';
 
        // Spinning particles
        for (let i = 0; i < 4; i++) {
            const angle = (this.time * 0.02) + (i * Math.PI / 2);
            const px = dx + Math.cos(angle) * (15 + pulse);
            const py = dy + Math.sin(angle) * (15 + pulse);
            ctx.fillStyle = '#88ffbb';
            ctx.fillRect(px - 2, py - 2, 4, 4);
        }
    }
};
 
// Start the game when page loads
window.addEventListener('load', () => {
    Game.init();
});