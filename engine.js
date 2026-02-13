// ============================================================
// SWORDCERY - Game Engine Core
// Input handling, camera, physics constants, utilities
// ============================================================
 
const CANVAS_WIDTH = 960;
const CANVAS_HEIGHT = 640;
const TILE = 40;
const GRAVITY = 0.6;
const MAX_FALL_SPEED = 14;
const FRICTION = 0.85;
 
// Color palette - vibrant medieval fantasy
const COLORS = {
    // Sky and environment
    skyTop: '#1a0a2e',
    skyMid: '#2d1b69',
    skyBottom: '#5c3d99',
    sunsetOrange: '#ff6b35',
    sunsetPink: '#ff1493',
    // Castle/fortress
    stoneLight: '#8b8682',
    stoneMid: '#6b6460',
    stoneDark: '#4a4540',
    stoneAccent: '#9a8c7a',
    mortar: '#3a3530',
    // Platforms / bridges
    woodLight: '#c4873b',
    woodDark: '#8b5e2b',
    woodAccent: '#daa06d',
    // Nature
    grassGreen: '#3cb043',
    grassDark: '#2d8633',
    treeGreen: '#228b22',
    treeDark: '#006400',
    // Lava/fire
    lavaOrange: '#ff4500',
    lavaYellow: '#ffa500',
    lavaRed: '#cc0000',
    // Water
    waterBlue: '#1e90ff',
    waterLight: '#87ceeb',
    // UI
    healthRed: '#dc143c',
    healthBg: '#3a0a0a',
    staminaGold: '#ffd700',
    staminaBg: '#3a3a0a',
    manaBlue: '#4169e1',
    uiBg: 'rgba(10,10,10,0.8)',
    uiBorder: '#8b7355',
    textGold: '#ffd700',
    textWhite: '#f0e6d3',
    // Enemies
    skeletonWhite: '#e8dcc8',
    skeletonDark: '#c4b8a4',
    witchPurple: '#9b30ff',
    witchDark: '#6a0dad',
    trollGreen: '#556b2f',
    trollDark: '#3a4a1f',
    // Player
    playerArmor: '#4682b4',
    playerArmorLight: '#6ca6cd',
    playerSkin: '#deb887',
    playerCape: '#8b0000',
    // Weapons
    swordSteel: '#c0c0c0',
    swordHilt: '#8b4513',
    arrowWood: '#a0522d',
    bowWood: '#8b6914',
    // Effects
    sparkYellow: '#ffff00',
    sparkOrange: '#ff8c00',
    hitWhite: '#ffffff',
    healGreen: '#00ff7f',
};
 
// Input state
const Input = {
    keys: {},
    mouse: { x: 0, y: 0, down: false, clicked: false },
    init(canvas) {
        window.addEventListener('keydown', e => {
            this.keys[e.key.toLowerCase()] = true;
            if (['space', 'tab'].includes(e.code.toLowerCase())) e.preventDefault();
            if (e.key === ' ') {
                this.keys['space'] = true;
                e.preventDefault();
            }
        });
        window.addEventListener('keyup', e => {
            this.keys[e.key.toLowerCase()] = false;
            if (e.key === ' ') this.keys['space'] = false;
        });
        canvas.addEventListener('mousemove', e => {
            const rect = canvas.getBoundingClientRect();
            this.mouse.x = (e.clientX - rect.left) * (CANVAS_WIDTH / rect.width);
            this.mouse.y = (e.clientY - rect.top) * (CANVAS_HEIGHT / rect.height);
        });
        canvas.addEventListener('mousedown', e => {
            this.mouse.down = true;
            this.mouse.clicked = true;
        });
        canvas.addEventListener('mouseup', e => {
            this.mouse.down = false;
        });
        canvas.addEventListener('contextmenu', e => e.preventDefault());
    },
    clearClick() {
        this.mouse.clicked = false;
    }
};
 
// Camera
class Camera {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.targetX = 0;
        this.targetY = 0;
        this.shakeX = 0;
        this.shakeY = 0;
        this.shakeIntensity = 0;
    }
    follow(target, levelWidth, levelHeight) {
        this.targetX = target.x + target.w / 2 - CANVAS_WIDTH / 2;
        this.targetY = target.y + target.h / 2 - CANVAS_HEIGHT / 2;
        this.x += (this.targetX - this.x) * 0.08;
        this.y += (this.targetY - this.y) * 0.08;
        // Clamp
        this.x = Math.max(0, Math.min(this.x, levelWidth - CANVAS_WIDTH));
        this.y = Math.max(0, Math.min(this.y, levelHeight - CANVAS_HEIGHT));
        // Shake
        if (this.shakeIntensity > 0) {
            this.shakeX = (Math.random() - 0.5) * this.shakeIntensity;
            this.shakeY = (Math.random() - 0.5) * this.shakeIntensity;
            this.shakeIntensity *= 0.9;
            if (this.shakeIntensity < 0.5) this.shakeIntensity = 0;
        } else {
            this.shakeX = 0;
            this.shakeY = 0;
        }
    }
    shake(intensity) {
        this.shakeIntensity = intensity;
    }
    getOffX() { return -Math.round(this.x + this.shakeX); }
    getOffY() { return -Math.round(this.y + this.shakeY); }
}
 
// Utility functions
function lerp(a, b, t) { return a + (b - a) * t; }
function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
function dist(x1, y1, x2, y2) { return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2); }
function angleTo(x1, y1, x2, y2) { return Math.atan2(y2 - y1, x2 - x1); }
function randRange(min, max) { return Math.random() * (max - min) + min; }
function randInt(min, max) { return Math.floor(randRange(min, max + 1)); }
 
// Collision detection
function rectsOverlap(a, b) {
    return a.x < b.x + b.w && a.x + a.w > b.x &&
           a.y < b.y + b.h && a.y + a.h > b.y;
}
 
// Simple AABB collision resolution
function resolveCollision(entity, platforms) {
    let onGround = false;
    for (const p of platforms) {
        if (!rectsOverlap(entity, p)) continue;
        const overlapX = Math.min(entity.x + entity.w - p.x, p.x + p.w - entity.x);
        const overlapY = Math.min(entity.y + entity.h - p.y, p.y + p.h - entity.y);
        if (overlapY < overlapX) {
            if (entity.y + entity.h / 2 < p.y + p.h / 2) {
                entity.y = p.y - entity.h;
                if (entity.vy > 0) entity.vy = 0;
                onGround = true;
            } else {
                entity.y = p.y + p.h;
                if (entity.vy < 0) entity.vy = 0;
            }
        } else {
            if (entity.x + entity.w / 2 < p.x + p.w / 2) {
                entity.x = p.x - entity.w;
            } else {
                entity.x = p.x + p.w;
            }
            entity.vx = 0;
        }
    }
    return onGround;
}