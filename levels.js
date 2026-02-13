// ============================================================
// SWORDCERY - Level Data
// 8 levels of progressive difficulty with medieval castle themes
// ============================================================
 
const LEVEL_NAMES = [
    'The Gatehouse',
    'Outer Walls',
    'The Bridge of Sighs',
    'Dungeon Depths',
    'The Armory Tower',
    'Witch\'s Spire',
    'Troll\'s Keep',
    'The Necromancer\'s Throne'
];
 
const LEVEL_DESCRIPTIONS = [
    'Begin your quest at the castle gates...',
    'Scale the mighty outer walls of the fortress...',
    'Cross the treacherous bridges over the abyss...',
    'Descend into the dark dungeons below...',
    'Climb the tower where weapons of old are stored...',
    'Brave the enchanted spire of the witches...',
    'Storm the keep of the troll warlord...',
    'Face the Necromancer in his dark throne room...'
];
 
function generateLevel(levelNum) {
    const level = {
        platforms: [],
        enemies: [],
        pickups: [],
        gems: [],
        torches: [],
        spawnX: 100,
        spawnY: 400,
        exitX: 0,
        exitY: 0,
        width: 3000,
        height: 900,
        platStyle: 'stone', // 'stone', 'wood', 'fortress'
        par: 0, // par time in frames (60fps)
    };
 
    switch (levelNum) {
        case 0: return buildLevel1(level);
        case 1: return buildLevel2(level);
        case 2: return buildLevel3(level);
        case 3: return buildLevel4(level);
        case 4: return buildLevel5(level);
        case 5: return buildLevel6(level);
        case 6: return buildLevel7(level);
        case 7: return buildLevel8(level);
    }
    return level;
}
 
// Helper to add a platform
function addPlat(level, x, y, w, h, style) {
    level.platforms.push({ x, y, w, h, style: style || level.platStyle });
}
 
// Level 1: The Gatehouse - Tutorial level, easy
function buildLevel1(level) {
    level.width = 3200;
    level.height = 900;
    level.spawnX = 80;
    level.spawnY = 650;
    level.platStyle = 'stone';
    level.par = 60 * 90; // 90 seconds
 
    // Ground
    addPlat(level, 0, 750, 800, 150);
    addPlat(level, 900, 750, 500, 150);
    addPlat(level, 1500, 750, 600, 150);
    addPlat(level, 2200, 750, 1000, 150);
 
    // Stepping platforms
    addPlat(level, 750, 650, 120, 20, 'wood');
    addPlat(level, 1380, 680, 100, 20, 'wood');
    addPlat(level, 2080, 680, 100, 20, 'wood');
 
    // Upper platforms
    addPlat(level, 300, 580, 200, 25, 'fortress');
    addPlat(level, 600, 500, 150, 25);
    addPlat(level, 1000, 580, 200, 25, 'fortress');
    addPlat(level, 1600, 550, 180, 25);
    addPlat(level, 1900, 480, 150, 25, 'fortress');
    addPlat(level, 2500, 550, 250, 25, 'fortress');
 
    // High secret platform with gem
    addPlat(level, 850, 380, 80, 20, 'wood');
    level.gems.push(new ScoreGem(875, 360, 200));
 
    // Enemies - just skeletons for level 1
    level.enemies.push(new Enemy(950, 710, 'skeleton'));
    level.enemies.push(new Enemy(1200, 710, 'skeleton'));
    level.enemies.push(new Enemy(1600, 710, 'skeleton'));
    level.enemies.push(new Enemy(2400, 710, 'skeleton'));
    level.enemies.push(new Enemy(2700, 710, 'skeleton'));
 
    // Pickups
    level.pickups.push(new HealthPickup(500, 560));
    level.pickups.push(new StaminaPickup(1100, 560));
    level.pickups.push(new HealthPickup(2300, 530));
 
    // Gems
    level.gems.push(new ScoreGem(350, 560, 50));
    level.gems.push(new ScoreGem(650, 480, 50));
    level.gems.push(new ScoreGem(1050, 560, 50));
    level.gems.push(new ScoreGem(1650, 530, 100));
    level.gems.push(new ScoreGem(1950, 460, 100));
    level.gems.push(new ScoreGem(2600, 530, 50));
 
    // Torches
    level.torches = [
        { x: 200, y: 720 }, { x: 500, y: 720 },
        { x: 1000, y: 720 }, { x: 1700, y: 720 },
        { x: 2400, y: 720 }, { x: 2800, y: 720 },
    ];
 
    // Exit
    level.exitX = 3000;
    level.exitY = 700;
 
    return level;
}
 
// Level 2: Outer Walls - More verticality
function buildLevel2(level) {
    level.width = 3600;
    level.height = 1000;
    level.spawnX = 80;
    level.spawnY = 750;
    level.platStyle = 'fortress';
    level.par = 60 * 100;
 
    // Ground sections with gaps
    addPlat(level, 0, 850, 500, 150);
    addPlat(level, 600, 850, 400, 150);
    addPlat(level, 1200, 850, 300, 150);
    addPlat(level, 1700, 850, 500, 150);
    addPlat(level, 2500, 850, 400, 150);
    addPlat(level, 3100, 850, 500, 150);
 
    // Wall climbing section
    addPlat(level, 200, 700, 150, 25, 'fortress');
    addPlat(level, 50, 580, 150, 25, 'fortress');
    addPlat(level, 250, 460, 150, 25, 'fortress');
    addPlat(level, 100, 350, 200, 25, 'fortress');
 
    // Bridge section
    addPlat(level, 500, 600, 300, 20, 'wood');
    addPlat(level, 900, 550, 250, 20, 'wood');
    addPlat(level, 1250, 500, 200, 20, 'wood');
 
    // Fortress wall tops
    addPlat(level, 1600, 650, 300, 30, 'fortress');
    addPlat(level, 2000, 580, 250, 30, 'fortress');
    addPlat(level, 2350, 500, 200, 30, 'fortress');
    addPlat(level, 2650, 600, 250, 30, 'fortress');
    addPlat(level, 3000, 650, 200, 30, 'fortress');
 
    // Enemies
    level.enemies.push(new Enemy(650, 810, 'skeleton'));
    level.enemies.push(new Enemy(850, 810, 'skeleton'));
    level.enemies.push(new Enemy(1300, 810, 'skeleton'));
    level.enemies.push(new Enemy(600, 560, 'skeleton_archer'));
    level.enemies.push(new Enemy(1800, 810, 'skeleton'));
    level.enemies.push(new Enemy(1900, 810, 'skeleton'));
    level.enemies.push(new Enemy(2100, 540, 'skeleton_archer'));
    level.enemies.push(new Enemy(2600, 810, 'skeleton'));
    level.enemies.push(new Enemy(3200, 810, 'skeleton'));
 
    // Pickups
    level.pickups.push(new HealthPickup(300, 440));
    level.pickups.push(new StaminaPickup(950, 530));
    level.pickups.push(new HealthPickup(2400, 480));
 
    // Gems
    for (let i = 0; i < 10; i++) {
        level.gems.push(new ScoreGem(300 + i * 300, 800 - (i % 3) * 100, i % 3 === 2 ? 100 : 50));
    }
    level.gems.push(new ScoreGem(150, 330, 200));
 
    level.torches = [
        { x: 150, y: 820 }, { x: 700, y: 820 },
        { x: 1400, y: 820 }, { x: 1900, y: 820 },
        { x: 2700, y: 820 }, { x: 3200, y: 820 },
    ];
 
    level.exitX = 3400;
    level.exitY = 800;
 
    return level;
}
 
// Level 3: Bridge of Sighs - Lots of gaps and bridges
function buildLevel3(level) {
    level.width = 4000;
    level.height = 1000;
    level.spawnX = 80;
    level.spawnY = 650;
    level.platStyle = 'wood';
    level.par = 60 * 110;
 
    // Starting platform
    addPlat(level, 0, 750, 250, 150);
 
    // Long bridge sections with gaps
    addPlat(level, 350, 720, 200, 15, 'wood');
    addPlat(level, 650, 700, 180, 15, 'wood');
    addPlat(level, 930, 680, 160, 15, 'wood');
    addPlat(level, 1200, 720, 200, 15, 'wood');
    addPlat(level, 1500, 700, 150, 15, 'wood');
 
    // Support pillars (stone) under bridges
    addPlat(level, 420, 735, 30, 265, 'stone');
    addPlat(level, 720, 715, 30, 285, 'stone');
    addPlat(level, 1270, 735, 30, 265, 'stone');
 
    // Mid section - fortress
    addPlat(level, 1750, 750, 400, 250, 'fortress');
 
    // Upper bridges
    addPlat(level, 1800, 550, 150, 15, 'wood');
    addPlat(level, 2050, 500, 150, 15, 'wood');
    addPlat(level, 2250, 550, 120, 15, 'wood');
 
    // Second bridge section
    addPlat(level, 2400, 700, 180, 15, 'wood');
    addPlat(level, 2680, 680, 160, 15, 'wood');
    addPlat(level, 2940, 660, 180, 15, 'wood');
    addPlat(level, 3220, 700, 150, 15, 'wood');
 
    addPlat(level, 2460, 715, 30, 285, 'stone');
    addPlat(level, 3000, 675, 30, 325, 'stone');
 
    // End fortress
    addPlat(level, 3500, 750, 500, 250, 'fortress');
 
    // Enemies
    level.enemies.push(new Enemy(400, 680, 'skeleton'));
    level.enemies.push(new Enemy(700, 660, 'skeleton'));
    level.enemies.push(new Enemy(1250, 680, 'skeleton'));
    level.enemies.push(new Enemy(1850, 710, 'skeleton_archer'));
    level.enemies.push(new Enemy(2000, 710, 'skeleton'));
    level.enemies.push(new Enemy(2100, 460, 'witch'));
    level.enemies.push(new Enemy(2500, 660, 'skeleton'));
    level.enemies.push(new Enemy(2750, 640, 'skeleton'));
    level.enemies.push(new Enemy(3300, 660, 'skeleton_archer'));
    level.enemies.push(new Enemy(3600, 710, 'skeleton'));
 
    level.pickups.push(new HealthPickup(1900, 530));
    level.pickups.push(new StaminaPickup(2700, 660));
    level.pickups.push(new HealthPickup(3600, 730));
 
    for (let i = 0; i < 12; i++) {
        level.gems.push(new ScoreGem(200 + i * 310, 650 - (i % 4) * 50, i % 4 === 3 ? 100 : 50));
    }
 
    level.torches = [
        { x: 100, y: 720 }, { x: 1850, y: 720 },
        { x: 2050, y: 720 }, { x: 3600, y: 720 },
    ];
 
    level.exitX = 3800;
    level.exitY = 700;
 
    return level;
}
 
// Level 4: Dungeon Depths - Dark, lower platforms, more enemies
function buildLevel4(level) {
    level.width = 3800;
    level.height = 1100;
    level.spawnX = 80;
    level.spawnY = 350;
    level.platStyle = 'stone';
    level.par = 60 * 120;
 
    // Upper entry
    addPlat(level, 0, 450, 300, 30);
 
    // Descending platforms
    addPlat(level, 350, 520, 150, 25);
    addPlat(level, 550, 600, 150, 25);
    addPlat(level, 750, 680, 150, 25);
    addPlat(level, 950, 760, 200, 25);
 
    // Dungeon floor
    addPlat(level, 1200, 850, 600, 250);
    addPlat(level, 1900, 850, 500, 250);
    addPlat(level, 2500, 850, 400, 250);
    addPlat(level, 3000, 850, 800, 250);
 
    // Dungeon upper ledges
    addPlat(level, 1300, 700, 120, 20);
    addPlat(level, 1550, 650, 100, 20);
    addPlat(level, 1750, 700, 120, 20);
    addPlat(level, 2000, 650, 150, 20);
    addPlat(level, 2300, 600, 100, 20);
    addPlat(level, 2600, 680, 120, 20);
    addPlat(level, 2900, 700, 150, 20);
 
    // Hidden upper path
    addPlat(level, 1400, 500, 100, 20);
    addPlat(level, 1700, 450, 100, 20);
    addPlat(level, 2000, 400, 100, 20);
 
    // Enemies
    level.enemies.push(new Enemy(400, 480, 'skeleton'));
    level.enemies.push(new Enemy(800, 640, 'skeleton'));
    level.enemies.push(new Enemy(1300, 810, 'skeleton'));
    level.enemies.push(new Enemy(1500, 810, 'skeleton'));
    level.enemies.push(new Enemy(1600, 810, 'skeleton_archer'));
    level.enemies.push(new Enemy(1700, 610, 'witch'));
    level.enemies.push(new Enemy(2000, 810, 'skeleton'));
    level.enemies.push(new Enemy(2200, 810, 'skeleton'));
    level.enemies.push(new Enemy(2600, 810, 'skeleton'));
    level.enemies.push(new Enemy(2800, 810, 'skeleton_archer'));
    level.enemies.push(new Enemy(3200, 810, 'troll'));
    level.enemies.push(new Enemy(3500, 810, 'skeleton'));
 
    level.pickups.push(new HealthPickup(1050, 740));
    level.pickups.push(new HealthPickup(2100, 630));
    level.pickups.push(new StaminaPickup(2400, 580));
    level.pickups.push(new HealthPickup(3100, 680));
 
    for (let i = 0; i < 15; i++) {
        level.gems.push(new ScoreGem(250 + i * 230, 800 - (i % 5) * 60,
            i % 5 === 4 ? 200 : i % 3 === 2 ? 100 : 50));
    }
    // Hidden path gems
    level.gems.push(new ScoreGem(1430, 480, 200));
    level.gems.push(new ScoreGem(1730, 430, 200));
    level.gems.push(new ScoreGem(2030, 380, 200));
 
    level.torches = [
        { x: 100, y: 420 }, { x: 600, y: 570 },
        { x: 1300, y: 820 }, { x: 1700, y: 820 },
        { x: 2100, y: 820 }, { x: 2600, y: 820 },
        { x: 3200, y: 820 }, { x: 3500, y: 820 },
    ];
 
    level.exitX = 3600;
    level.exitY = 800;
 
    return level;
}
 
// Level 5: Armory Tower - Vertical climbing
function buildLevel5(level) {
    level.width = 3000;
    level.height = 1400;
    level.spawnX = 80;
    level.spawnY = 1150;
    level.platStyle = 'fortress';
    level.par = 60 * 130;
 
    // Ground
    addPlat(level, 0, 1250, 400, 150);
 
    // Tower climb - zigzag
    addPlat(level, 100, 1100, 200, 25, 'fortress');
    addPlat(level, 400, 1000, 200, 25, 'fortress');
    addPlat(level, 150, 900, 200, 25, 'fortress');
    addPlat(level, 450, 800, 200, 25, 'fortress');
    addPlat(level, 150, 700, 200, 25, 'fortress');
    addPlat(level, 450, 600, 250, 25, 'fortress');
 
    // Mid tower platform
    addPlat(level, 700, 700, 400, 30, 'fortress');
    addPlat(level, 750, 550, 300, 25);
 
    // Upper tower section
    addPlat(level, 1100, 650, 200, 25, 'wood');
    addPlat(level, 1350, 550, 200, 25, 'fortress');
    addPlat(level, 1100, 450, 200, 25, 'wood');
    addPlat(level, 1350, 350, 200, 25, 'fortress');
    addPlat(level, 1100, 250, 250, 25, 'fortress');
 
    // Horizontal section at top
    addPlat(level, 1400, 250, 200, 25);
    addPlat(level, 1700, 300, 200, 25, 'wood');
    addPlat(level, 2000, 250, 200, 25, 'fortress');
    addPlat(level, 2300, 300, 200, 25, 'wood');
    addPlat(level, 2550, 250, 300, 30, 'fortress');
 
    // Side platforms
    addPlat(level, 800, 900, 150, 20);
    addPlat(level, 1000, 1000, 150, 20, 'wood');
    addPlat(level, 1200, 1100, 200, 20);
 
    // Enemies
    level.enemies.push(new Enemy(450, 960, 'skeleton'));
    level.enemies.push(new Enemy(200, 860, 'skeleton'));
    level.enemies.push(new Enemy(500, 760, 'skeleton_archer'));
    level.enemies.push(new Enemy(800, 660, 'skeleton'));
    level.enemies.push(new Enemy(900, 660, 'skeleton'));
    level.enemies.push(new Enemy(1150, 610, 'witch'));
    level.enemies.push(new Enemy(1400, 510, 'skeleton_archer'));
    level.enemies.push(new Enemy(1150, 410, 'skeleton'));
    level.enemies.push(new Enemy(1400, 310, 'witch'));
    level.enemies.push(new Enemy(1750, 260, 'skeleton'));
    level.enemies.push(new Enemy(2050, 210, 'skeleton'));
    level.enemies.push(new Enemy(2350, 260, 'skeleton_archer'));
    level.enemies.push(new Enemy(2650, 210, 'troll'));
 
    level.pickups.push(new HealthPickup(300, 880));
    level.pickups.push(new HealthPickup(850, 530));
    level.pickups.push(new StaminaPickup(1200, 430));
    level.pickups.push(new HealthPickup(2050, 230));
 
    for (let i = 0; i < 18; i++) {
        const px = 150 + (i % 6) * 200 + Math.sin(i) * 100;
        const py = 1050 - i * 50;
        level.gems.push(new ScoreGem(px, py, i % 4 === 3 ? 100 : 50));
    }
 
    level.torches = [
        { x: 100, y: 1220 }, { x: 300, y: 1070 },
        { x: 500, y: 770 }, { x: 800, y: 670 },
        { x: 1200, y: 220 }, { x: 2600, y: 220 },
    ];
 
    level.exitX = 2750;
    level.exitY = 200;
 
    return level;
}
 
// Level 6: Witch's Spire - Many witches, magic projectiles
function buildLevel6(level) {
    level.width = 4000;
    level.height = 1000;
    level.spawnX = 80;
    level.spawnY = 650;
    level.platStyle = 'stone';
    level.par = 60 * 140;
 
    // Ground with many gaps
    addPlat(level, 0, 750, 300, 150);
    addPlat(level, 400, 750, 200, 150);
    addPlat(level, 700, 750, 300, 150);
    addPlat(level, 1200, 750, 200, 150);
    addPlat(level, 1600, 750, 300, 150);
    addPlat(level, 2100, 750, 200, 150);
    addPlat(level, 2500, 750, 250, 150);
    addPlat(level, 2900, 750, 200, 150);
    addPlat(level, 3300, 750, 200, 150);
    addPlat(level, 3700, 750, 300, 150);
 
    // Elevated platforms (spire levels)
    addPlat(level, 150, 600, 120, 20, 'fortress');
    addPlat(level, 500, 550, 150, 20, 'fortress');
    addPlat(level, 800, 480, 120, 20, 'fortress');
    addPlat(level, 1100, 420, 150, 20, 'fortress');
    addPlat(level, 1400, 480, 120, 20, 'fortress');
    addPlat(level, 1700, 520, 150, 20, 'fortress');
    addPlat(level, 2000, 450, 120, 20, 'fortress');
    addPlat(level, 2300, 400, 150, 20, 'fortress');
    addPlat(level, 2600, 480, 120, 20, 'fortress');
    addPlat(level, 2900, 550, 150, 20, 'fortress');
    addPlat(level, 3200, 480, 120, 20, 'fortress');
    addPlat(level, 3500, 420, 150, 20, 'fortress');
    addPlat(level, 3800, 500, 120, 20, 'fortress');
 
    // Moving bridges
    addPlat(level, 350, 680, 80, 12, 'wood');
    addPlat(level, 1050, 680, 80, 12, 'wood');
    addPlat(level, 1450, 680, 80, 12, 'wood');
 
    // Enemies - lots of witches
    level.enemies.push(new Enemy(300, 710, 'skeleton'));
    level.enemies.push(new Enemy(550, 510, 'witch'));
    level.enemies.push(new Enemy(800, 710, 'skeleton'));
    level.enemies.push(new Enemy(850, 440, 'witch'));
    level.enemies.push(new Enemy(1150, 380, 'witch'));
    level.enemies.push(new Enemy(1300, 710, 'skeleton_archer'));
    level.enemies.push(new Enemy(1700, 710, 'skeleton'));
    level.enemies.push(new Enemy(1750, 480, 'witch'));
    level.enemies.push(new Enemy(2050, 410, 'witch'));
    level.enemies.push(new Enemy(2350, 360, 'witch'));
    level.enemies.push(new Enemy(2600, 710, 'troll'));
    level.enemies.push(new Enemy(3000, 710, 'skeleton'));
    level.enemies.push(new Enemy(3250, 440, 'witch'));
    level.enemies.push(new Enemy(3550, 380, 'witch'));
    level.enemies.push(new Enemy(3800, 710, 'skeleton'));
 
    level.pickups.push(new HealthPickup(200, 580));
    level.pickups.push(new HealthPickup(1200, 400));
    level.pickups.push(new StaminaPickup(2000, 430));
    level.pickups.push(new HealthPickup(2900, 530));
    level.pickups.push(new HealthPickup(3500, 400));
 
    for (let i = 0; i < 20; i++) {
        level.gems.push(new ScoreGem(200 + i * 190, 700 - (i % 5) * 60,
            i % 5 === 4 ? 200 : i % 3 === 2 ? 100 : 50));
    }
 
    level.torches = [
        { x: 100, y: 720 }, { x: 500, y: 720 },
        { x: 900, y: 720 }, { x: 1400, y: 720 },
        { x: 1800, y: 720 }, { x: 2300, y: 720 },
        { x: 2700, y: 720 }, { x: 3100, y: 720 },
        { x: 3500, y: 720 }, { x: 3900, y: 720 },
    ];
 
    level.exitX = 3900;
    level.exitY = 700;
 
    return level;
}
 
// Level 7: Troll's Keep - Heavy enemies, tight spaces
function buildLevel7(level) {
    level.width = 4200;
    level.height = 1000;
    level.spawnX = 80;
    level.spawnY = 650;
    level.platStyle = 'fortress';
    level.par = 60 * 150;
 
    // Fortress sections with thick walls
    addPlat(level, 0, 750, 400, 250, 'fortress');
    addPlat(level, 500, 750, 300, 250, 'fortress');
    addPlat(level, 900, 750, 400, 250, 'fortress');
    addPlat(level, 1400, 750, 350, 250, 'fortress');
    addPlat(level, 1850, 750, 400, 250, 'fortress');
    addPlat(level, 2350, 750, 300, 250, 'fortress');
    addPlat(level, 2750, 750, 350, 250, 'fortress');
    addPlat(level, 3200, 750, 400, 250, 'fortress');
    addPlat(level, 3700, 750, 500, 250, 'fortress');
 
    // Gaps bridged by wood
    addPlat(level, 400, 730, 100, 12, 'wood');
    addPlat(level, 800, 730, 100, 12, 'wood');
    addPlat(level, 1300, 730, 100, 12, 'wood');
    addPlat(level, 1750, 730, 100, 12, 'wood');
    addPlat(level, 2250, 730, 100, 12, 'wood');
    addPlat(level, 2650, 730, 100, 12, 'wood');
    addPlat(level, 3100, 730, 100, 12, 'wood');
    addPlat(level, 3600, 730, 100, 12, 'wood');
 
    // Upper fortress levels
    addPlat(level, 100, 580, 200, 25, 'fortress');
    addPlat(level, 500, 520, 200, 25, 'fortress');
    addPlat(level, 900, 580, 200, 25, 'fortress');
    addPlat(level, 1400, 520, 200, 25, 'fortress');
    addPlat(level, 1900, 500, 200, 25, 'fortress');
    addPlat(level, 2400, 560, 200, 25, 'fortress');
    addPlat(level, 2800, 500, 200, 25, 'fortress');
    addPlat(level, 3200, 520, 250, 25, 'fortress');
    addPlat(level, 3700, 480, 250, 25, 'fortress');
 
    // Enemies - many trolls
    level.enemies.push(new Enemy(250, 700, 'troll'));
    level.enemies.push(new Enemy(600, 710, 'skeleton'));
    level.enemies.push(new Enemy(700, 710, 'skeleton'));
    level.enemies.push(new Enemy(1000, 700, 'troll'));
    level.enemies.push(new Enemy(1100, 540, 'witch'));
    level.enemies.push(new Enemy(1500, 710, 'skeleton_archer'));
    level.enemies.push(new Enemy(1600, 710, 'skeleton'));
    level.enemies.push(new Enemy(1950, 700, 'troll'));
    level.enemies.push(new Enemy(2000, 460, 'witch'));
    level.enemies.push(new Enemy(2450, 710, 'skeleton'));
    level.enemies.push(new Enemy(2550, 710, 'skeleton_archer'));
    level.enemies.push(new Enemy(2850, 700, 'troll'));
    level.enemies.push(new Enemy(3300, 710, 'skeleton'));
    level.enemies.push(new Enemy(3400, 710, 'skeleton'));
    level.enemies.push(new Enemy(3500, 480, 'witch'));
    level.enemies.push(new Enemy(3800, 700, 'troll'));
    level.enemies.push(new Enemy(3900, 710, 'skeleton_archer'));
 
    level.pickups.push(new HealthPickup(300, 560));
    level.pickups.push(new HealthPickup(1000, 560));
    level.pickups.push(new StaminaPickup(1500, 500));
    level.pickups.push(new HealthPickup(2000, 480));
    level.pickups.push(new HealthPickup(2850, 480));
    level.pickups.push(new StaminaPickup(3300, 500));
 
    for (let i = 0; i < 22; i++) {
        level.gems.push(new ScoreGem(100 + i * 185, 700 - (i % 4) * 50,
            i % 4 === 3 ? 200 : i % 3 === 2 ? 100 : 50));
    }
 
    level.torches = [
        { x: 100, y: 720 }, { x: 600, y: 720 },
        { x: 1000, y: 720 }, { x: 1500, y: 720 },
        { x: 2000, y: 720 }, { x: 2500, y: 720 },
        { x: 3000, y: 720 }, { x: 3500, y: 720 },
        { x: 3900, y: 720 },
    ];
 
    level.exitX = 4050;
    level.exitY = 700;
 
    return level;
}
 
// Level 8: The Necromancer's Throne - Boss level
function buildLevel8(level) {
    level.width = 4500;
    level.height = 1000;
    level.spawnX = 80;
    level.spawnY = 650;
    level.platStyle = 'fortress';
    level.par = 60 * 180;
 
    // Gauntlet section
    addPlat(level, 0, 750, 300, 250, 'fortress');
    addPlat(level, 400, 750, 200, 250);
    addPlat(level, 700, 750, 300, 250, 'fortress');
    addPlat(level, 1100, 750, 200, 250);
    addPlat(level, 1400, 750, 300, 250, 'fortress');
    addPlat(level, 1800, 750, 200, 250);
 
    // Bridge gaps
    addPlat(level, 300, 730, 100, 12, 'wood');
    addPlat(level, 600, 730, 100, 12, 'wood');
    addPlat(level, 1000, 730, 100, 12, 'wood');
    addPlat(level, 1300, 730, 100, 12, 'wood');
    addPlat(level, 1700, 730, 100, 12, 'wood');
 
    // Upper gauntlet
    addPlat(level, 100, 580, 150, 20, 'fortress');
    addPlat(level, 400, 520, 150, 20, 'fortress');
    addPlat(level, 700, 460, 150, 20, 'fortress');
    addPlat(level, 1000, 520, 150, 20, 'fortress');
    addPlat(level, 1300, 460, 150, 20, 'fortress');
    addPlat(level, 1600, 520, 150, 20, 'fortress');
 
    // Throne room approach
    addPlat(level, 2100, 750, 600, 250, 'fortress');
    addPlat(level, 2100, 550, 150, 20, 'fortress');
    addPlat(level, 2400, 600, 150, 20, 'fortress');
    addPlat(level, 2600, 550, 100, 20);
 
    // BOSS ARENA
    addPlat(level, 2800, 750, 1700, 250, 'fortress');
    // Arena pillars
    addPlat(level, 3000, 500, 40, 250, 'stone');
    addPlat(level, 3400, 500, 40, 250, 'stone');
    addPlat(level, 3800, 500, 40, 250, 'stone');
    // Arena upper platforms
    addPlat(level, 2900, 550, 120, 20, 'fortress');
    addPlat(level, 3150, 480, 120, 20, 'fortress');
    addPlat(level, 3450, 550, 120, 20, 'fortress');
    addPlat(level, 3700, 480, 120, 20, 'fortress');
    addPlat(level, 3950, 550, 120, 20, 'fortress');
    addPlat(level, 4200, 480, 120, 20, 'fortress');
 
    // Gauntlet enemies
    level.enemies.push(new Enemy(200, 710, 'skeleton'));
    level.enemies.push(new Enemy(450, 710, 'skeleton'));
    level.enemies.push(new Enemy(500, 480, 'witch'));
    level.enemies.push(new Enemy(800, 710, 'skeleton'));
    level.enemies.push(new Enemy(850, 420, 'witch'));
    level.enemies.push(new Enemy(1200, 700, 'troll'));
    level.enemies.push(new Enemy(1500, 710, 'skeleton_archer'));
    level.enemies.push(new Enemy(1600, 710, 'skeleton'));
    level.enemies.push(new Enemy(1700, 480, 'witch'));
 
    // Approach enemies
    level.enemies.push(new Enemy(2200, 710, 'troll'));
    level.enemies.push(new Enemy(2400, 710, 'skeleton_archer'));
    level.enemies.push(new Enemy(2600, 710, 'witch'));
 
    // BOSS
    level.enemies.push(new Enemy(3600, 700, 'boss_necromancer'));
    // Boss adds
    level.enemies.push(new Enemy(3200, 710, 'skeleton'));
    level.enemies.push(new Enemy(3800, 710, 'skeleton'));
    level.enemies.push(new Enemy(4000, 710, 'skeleton_archer'));
 
    level.pickups.push(new HealthPickup(300, 560));
    level.pickups.push(new HealthPickup(900, 440));
    level.pickups.push(new StaminaPickup(1400, 440));
    level.pickups.push(new HealthPickup(2200, 530));
    level.pickups.push(new HealthPickup(3100, 480));
    level.pickups.push(new HealthPickup(3500, 530));
    level.pickups.push(new StaminaPickup(3900, 530));
    level.pickups.push(new HealthPickup(4200, 460));
 
    for (let i = 0; i < 25; i++) {
        level.gems.push(new ScoreGem(100 + i * 170, 700 - (i % 5) * 50,
            i % 5 === 4 ? 200 : i % 3 === 2 ? 100 : 50));
    }
 
    level.torches = [
        { x: 100, y: 720 }, { x: 500, y: 720 },
        { x: 900, y: 720 }, { x: 1300, y: 720 },
        { x: 1700, y: 720 }, { x: 2300, y: 720 },
        { x: 2900, y: 720 }, { x: 3200, y: 720 },
        { x: 3600, y: 720 }, { x: 4000, y: 720 },
        { x: 4300, y: 720 },
    ];
 
    level.exitX = 4350;
    level.exitY = 700;
 
    return level;
}