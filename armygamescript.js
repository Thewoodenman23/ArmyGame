// Game Variables
let gold = 0;
let food = 0;
let soldiers = 0;
let shield = 0; // New resource for Spartans
let prestigePoints = 0;
let faction = null; // Current faction
let goldPerClick = 1;
let goldPerSecond = 0;

// Territories Data
const territories = [
    { id: 1, name: "Territory A", owner: "Neutral", defense: 50, bonus: { goldPerSecond: 5 }, conquerCost: { gold: 100, soldiers: 10 } },
    { id: 2, name: "Territory B", owner: "Neutral", defense: 100, bonus: { foodPerSecond: 5 }, conquerCost: { gold: 200, soldiers: 20 } },
    { id: 3, name: "Territory C", owner: "Neutral", defense: 150, bonus: { shieldPerSecond: 2 }, conquerCost: { gold: 300, soldiers: 30 } },
    // Add more territories as needed
];

// Upgrades Array
const upgrades = {
    army: [
        { name: "Advanced Training", cost: 50, goldPerSecond: 5, owned: 0, originalCost: 50 },
        { name: "Elite Units", cost: 150, goldPerSecond: 15, owned: 0, originalCost: 150 },
        // Add more army upgrades
    ],
    economy: [
        { name: "Market Expansion", cost: 100, goldPerSecond: 10, owned: 0, originalCost: 100 },
        { name: "Trade Agreements", cost: 300, goldPerSecond: 30, owned: 0, originalCost: 300 },
        // Add more economy upgrades
    ]
};

// Achievements Array
const achievements = [
    { name: "First Recruit", description: "Recruit your first soldier.", unlocked: false },
    { name: "Recruit Master", description: "Recruit 100 soldiers.", unlocked: false },
    { name: "Wealthy Commander", description: "Accumulate 1000 gold.", unlocked: false },
    { name: "Economic Genius", description: "Complete prestige with Romans.", unlocked: false },
    { name: "Agricultural Expert", description: "Complete prestige with Egyptians.", unlocked: false },
    { name: "Warrior Spirit", description: "Complete prestige with Gauls.", unlocked: false },
    { name: "Viking Raider", description: "Complete prestige with Vikings.", unlocked: false },
    { name: "Spartan Shield", description: "Complete prestige with Spartans.", unlocked: false },
    { name: "Mongol Conqueror", description: "Complete prestige with Mongols.", unlocked: false },
    { name: "Mission Master", description: "Complete 5 missions.", unlocked: false },
    { name: "Territory Holder", description: "Control 3 territories.", unlocked: false },
    // Add more achievements
];

// Missions Array
const missions = [
    { id: 1, name: "Scout the North", description: "Spend 100 Gold and 10 Soldiers to scout.", reward: { gold: 150, prestige: 1 }, status: "available" },
    { id: 2, name: "Defend the Borders", description: "Spend 200 Gold and 20 Soldiers to defend.", reward: { gold: 250, prestige: 2 }, status: "available" },
    { id: 3, name: "Conquer Enemy Base", description: "Spend 300 Gold and 30 Soldiers to conquer.", reward: { gold: 400, prestige: 3 }, status: "available" },
    // Add more missions
];

// Research Array
const research = [
    { id: 1, name: "Basic Tactics", description: "Increase soldiers' gold per click by 10%.", cost: { prestige: 2 }, unlocked: false },
    { id: 2, name: "Advanced Warfare", description: "Increase gold per second by 20%.", cost: { prestige: 5 }, unlocked: false },
    { id: 3, name: "Resource Management", description: "Reduce upgrade costs by 10%.", cost: { prestige: 8 }, unlocked: false },
    // Add more research items
];

// Buildings Array
const buildings = [
    { id: 1, name: "Barracks", description: "Increase soldier capacity by 10.", cost: { gold: 500 }, level: 0 },
    { id: 2, name: "Farm", description: "Increase food per second by 5.", cost: { gold: 700 }, level: 0 },
    { id: 3, name: "Forge", description: "Increase shield per second by 2.", cost: { gold: 1000 }, level: 0 },
    // Add more buildings
];

// DOM Elements
const goldSpan = document.getElementById('gold');
const foodSpan = document.getElementById('food');
const soldiersSpan = document.getElementById('soldiers');
const shieldSpan = document.getElementById('shield');
const prestigePointsSpan = document.getElementById('prestigePoints');
const recruitButton = document.getElementById('recruitButton');
const armyUpgradesDiv = document.getElementById('armyUpgrades');
const economyUpgradesDiv = document.getElementById('economyUpgrades');
const prestigeButton = document.getElementById('prestigeButton');
const achievementsDiv = document.getElementById('achievements');
const territoriesDiv = document.getElementById('territories');
const researchTreeDiv = document.getElementById('researchTree');
const buildingsListDiv = document.getElementById('buildingsList');
const missionsListDiv = document.getElementById('missionsList');
const factionButtons = document.querySelectorAll('.faction-button');
const muteCheckbox = document.getElementById('mute');
const toastContainer = document.querySelector('.toast-container');

// Sound Effects
const clickSound = new Audio('assets/sounds/click.mp3');
const upgradeSound = new Audio('assets/sounds/upgrade.mp3');
const prestigeSound = new Audio('assets/sounds/prestige.mp3');
const conquerSound = new Audio('assets/sounds/conquer.mp3');
const missionSound = new Audio('assets/sounds/mission.mp3');
const researchSound = new Audio('assets/sounds/research.mp3');
const buildingSound = new Audio('assets/sounds/building.mp3');

// Initialize Game
function init() {
    loadGame();
    updateDisplay();
    renderArmyUpgrades();
    renderEconomyUpgrades();
    renderAchievements();
    renderTerritories();
    renderResearchTree();
    renderBuildings();
    renderMissions();
    setupAutoGenerators();
    setupTabNavigation();
    setupKeyboardNavigation();
}

// Update Display
function updateDisplay() {
    goldSpan.textContent = gold;
    foodSpan.textContent = food;
    soldiersSpan.textContent = soldiers;
    shieldSpan.textContent = shield;
    prestigePointsSpan.textContent = prestigePoints;
    checkAchievements();
    applyTerritoryBonuses();
    applyBuildingBonuses();
}

// Recruit Soldiers (Manual Action)
function recruitSoldiers() {
    soldiers += 1;
    gold += goldPerClick;
    playSound(clickSound);
    showToast(`Recruited 1 soldier. Gold increased by ${goldPerClick}.`);
    updateDisplay();
    saveGame();
}

// Render Army Upgrades
function renderArmyUpgrades() {
    armyUpgradesDiv.innerHTML = '<h3>Army Upgrades</h3>';
    upgrades.army.forEach((upgrade, index) => {
        const upgradeDiv = document.createElement('div');
        upgradeDiv.classList.add('upgrade');
        upgradeDiv.innerHTML = `
            <h4>${upgrade.name}</h4>
            <p>Cost: ${upgrade.cost} Gold</p>
            <p>Generates: ${upgrade.goldPerSecond} Gold/sec</p>
            <p>Owned: ${upgrade.owned}</p>
            <button id="army-upgrade-${index}" ${gold < upgrade.cost ? 'disabled' : ''} aria-label="Buy ${upgrade.name}">${gold < upgrade.cost ? 'Locked' : 'Buy'}</button>
        `;
        armyUpgradesDiv.appendChild(upgradeDiv);
        document.getElementById(`army-upgrade-${index}`).addEventListener('click', () => buyArmyUpgrade(index));
    });
}

// Buy Army Upgrade
function buyArmyUpgrade(index) {
    const upgrade = upgrades.army[index];
    if (gold >= upgrade.cost) {
        gold -= upgrade.cost;
        goldPerSecond += upgrade.goldPerSecond;
        upgrade.owned += 1;
        // Increase the cost for next purchase
        upgrade.cost = Math.floor(upgrade.cost * 1.5);
        playSound(upgradeSound);
        showToast(`Purchased ${upgrade.name}. Gold/sec increased by ${upgrade.goldPerSecond}.`);
        updateDisplay();
        renderArmyUpgrades();
        saveGame();
    } else {
        showToast("Not enough gold to buy this army upgrade!", "error");
    }
}

// Render Economy Upgrades
function renderEconomyUpgrades() {
    economyUpgradesDiv.innerHTML = '<h3>Economy Upgrades</h3>';
    upgrades.economy.forEach((upgrade, index) => {
        const upgradeDiv = document.createElement('div');
        upgradeDiv.classList.add('upgrade');
        upgradeDiv.innerHTML = `
            <h4>${upgrade.name}</h4>
            <p>Cost: ${upgrade.cost} Gold</p>
            <p>Generates: ${upgrade.goldPerSecond} Gold/sec</p>
            <p>Owned: ${upgrade.owned}</p>
            <button id="economy-upgrade-${index}" ${gold < upgrade.cost ? 'disabled' : ''} aria-label="Buy ${upgrade.name}">${gold < upgrade.cost ? 'Locked' : 'Buy'}</button>
        `;
        economyUpgradesDiv.appendChild(upgradeDiv);
        document.getElementById(`economy-upgrade-${index}`).addEventListener('click', () => buyEconomyUpgrade(index));
    });
}

// Buy Economy Upgrade
function buyEconomyUpgrade(index) {
    const upgrade = upgrades.economy[index];
    if (gold >= upgrade.cost) {
        gold -= upgrade.cost;
        goldPerSecond += upgrade.goldPerSecond;
        upgrade.owned += 1;
        // Increase the cost for next purchase
        upgrade.cost = Math.floor(upgrade.cost * 1.5);
        playSound(upgradeSound);
        showToast(`Purchased ${upgrade.name}. Gold/sec increased by ${upgrade.goldPerSecond}.`);
        updateDisplay();
        renderEconomyUpgrades();
        saveGame();
    } else {
        showToast("Not enough gold to buy this economy upgrade!", "error");
    }
}

// Render Territories
function renderTerritories() {
    territoriesDiv.innerHTML = '<h3>Your Territories</h3>';
    territories.forEach(territory => {
        const territoryDiv = document.createElement('div');
        territoryDiv.classList.add('territory');
        territoryDiv.innerHTML = `
            <i class="fas fa-map-marker-alt territory-icon"></i>
            <div class="territory-name">${territory.name}</div>
            <div class="territory-owner">Owner: ${territory.owner}</div>
            <div class="territory-bonus">Bonus: ${formatBonus(territory.bonus)}</div>
            <button class="conquer-button" ${canConquer(territory) ? '' : 'disabled'} data-territory-id="${territory.id}" aria-label="Conquer ${territory.name}">
                <i class="fas fa-bullseye"></i> Conquer
            </button>
        `;
        territoriesDiv.appendChild(territoryDiv);
    });
    
    // Add event listeners to conquer buttons
    document.querySelectorAll('.conquer-button').forEach(button => {
        button.addEventListener('click', () => {
            const territoryId = parseInt(button.getAttribute('data-territory-id'));
            attemptConquer(territoryId);
        });
    });
}

// Format Bonus Display
function formatBonus(bonus) {
    let bonusStr = '';
    for (const key in bonus) {
        if (bonus.hasOwnProperty(key)) {
            if (bonus[key] > 0) {
                bonusStr += `${capitalizeFirstLetter(key.replace("PerSecond", ""))}: +${bonus[key]}${key.includes("PerSecond") ? "/sec" : ''} `;
            }
        }
    }
    return bonusStr.trim();
}

// Capitalize First Letter
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Determine if Territory Can Be Conquered
function canConquer(territory) {
    // Define logic to enable or disable the conquer button
    // For simplicity, require sufficient gold and soldiers
    return gold >= territory.conquerCost.gold && soldiers >= territory.conquerCost.soldiers;
}

// Attempt to Conquer Territory
function attemptConquer(territoryId) {
    const territory = territories.find(t => t.id === territoryId);
    if (!territory) return;
    
    if (gold >= territory.conquerCost.gold && soldiers >= territory.conquerCost.soldiers) {
        // Deduct cost
        gold -= territory.conquerCost.gold;
        soldiers -= territory.conquerCost.soldiers;
        
        // Simple battle logic: success rate based on soldiers vs defense
        const successRate = Math.min((soldiers / territory.defense) * 100, 90); // Cap success rate at 90%
        const random = Math.random() * 100;
        
        if (random <= successRate) {
            territory.owner = "Player";
            playSound(conquerSound);
            showToast(`Successfully conquered ${territory.name}!`);
        } else {
            showToast(`Failed to conquer ${territory.name}. Try again!`, "error");
        }
        
        updateDisplay();
        renderTerritories();
        saveGame();
    } else {
        showToast("Not enough resources to conquer this territory!", "error");
    }
}

// Apply Territory Bonuses
function applyTerritoryBonuses() {
    // Reset territory-based bonuses
    goldPerSecond = 0;
    // Apply bonuses from controlled territories
    territories.forEach(territory => {
        if (territory.owner === "Player") {
            if (territory.bonus.goldPerSecond) {
                goldPerSecond += territory.bonus.goldPerSecond;
            }
            if (territory.bonus.foodPerSecond) {
                food += territory.bonus.foodPerSecond;
            }
            if (territory.bonus.shieldPerSecond) {
                shield += territory.bonus.shieldPerSecond;
            }
        }
    });
}

// Render Research Tree
function renderResearchTree() {
    researchTreeDiv.innerHTML = '<h3>Research & Technology</h3>';
    research.forEach(item => {
        const researchDiv = document.createElement('div');
        researchDiv.classList.add('research-item');
        researchDiv.innerHTML = `
            <h4>${item.name}</h4>
            <p>${item.description}</p>
            <p>Cost: ${item.cost.prestige} Prestige Points</p>
            <button id="research-${item.id}" ${prestigePoints < item.cost.prestige || item.unlocked ? 'disabled' : ''} aria-label="Unlock ${item.name}">${prestigePoints < item.cost.prestige || item.unlocked ? 'Locked' : 'Unlock'}</button>
        `;
        researchTreeDiv.appendChild(researchDiv);
        document.getElementById(`research-${item.id}`).addEventListener('click', () => unlockResearch(item.id));
    });
}

// Unlock Research
function unlockResearch(id) {
    const researchItem = research.find(r => r.id === id);
    if (prestigePoints >= researchItem.cost.prestige && !researchItem.unlocked) {
        prestigePoints -= researchItem.cost.prestige;
        researchItem.unlocked = true;
        applyResearchBonus(researchItem);
        playSound(researchSound);
        showToast(`Unlocked Research: ${researchItem.name}`);
        updateDisplay();
        renderResearchTree();
        saveGame();
    } else {
        showToast("Not enough prestige points or already unlocked!", "error");
    }
}

// Apply Research Bonus
function applyResearchBonus(item) {
    switch (item.name) {
        case "Basic Tactics":
            goldPerClick = Math.floor(goldPerClick * 1.10);
            break;
        case "Advanced Warfare":
            goldPerSecond = Math.floor(goldPerSecond * 1.20);
            break;
        case "Resource Management":
            // Reduce all upgrade costs by 10%
            for (const category in upgrades) {
                if (upgrades.hasOwnProperty(category)) {
                    upgrades[category].forEach(upg => {
                        upg.cost = Math.floor(upg.cost * 0.90);
                    });
                }
            }
            renderArmyUpgrades();
            renderEconomyUpgrades();
            break;
        // Add more research cases as needed
        default:
            break;
    }
}

// Render Buildings
function renderBuildings() {
    buildingsListDiv.innerHTML = '<h3>Buildings</h3>';
    buildings.forEach(building => {
        const buildingDiv = document.createElement('div');
        buildingDiv.classList.add('building');
        buildingDiv.innerHTML = `
            <h4>${building.name} (Level ${building.level})</h4>
            <p>${building.description}</p>
            <p>Cost: ${building.cost.gold} Gold</p>
            <button id="building-${building.id}" ${gold < building.cost.gold ? 'disabled' : ''} aria-label="Construct ${building.name}">${gold < building.cost.gold ? 'Locked' : 'Construct'}</button>
        `;
        buildingsListDiv.appendChild(buildingDiv);
        document.getElementById(`building-${building.id}`).addEventListener('click', () => buildBuilding(building.id));
    });
}

// Build Building
function buildBuilding(id) {
    const building = buildings.find(b => b.id === id);
    if (gold >= building.cost.gold) {
        gold -= building.cost.gold;
        building.level += 1;
        applyBuildingBonus(building);
        playSound(buildingSound);
        showToast(`Constructed ${building.name} (Level ${building.level}).`);
        updateDisplay();
        renderBuildings();
        saveGame();
    } else {
        showToast("Not enough gold to construct this building!", "error");
    }
}

// Apply Building Bonuses
function applyBuildingBonus(building) {
    switch (building.name) {
        case "Barracks":
            // Example: Increase soldiers' effectiveness
            goldPerClick = Math.floor(goldPerClick * 1.05); // +5% per level
            break;
        case "Farm":
            // Increase food per second by 5 per level
            food += 5;
            break;
        case "Forge":
            // Increase shield per second by 2 per level
            shield += 2;
            break;
        // Add more building cases as needed
        default:
            break;
    }
}

// Render Missions
function renderMissions() {
    missionsListDiv.innerHTML = '<h3>Available Missions</h3>';
    missions.forEach(mission => {
        const missionDiv = document.createElement('div');
        missionDiv.classList.add('mission');
        missionDiv.innerHTML = `
            <h4>${mission.name}</h4>
            <p>${mission.description}</p>
            <p>Reward: ${mission.reward.gold} Gold, ${mission.reward.prestige} Prestige Points</p>
            <button id="mission-${mission.id}" ${canStartMission(mission) ? '' : 'disabled'} aria-label="Start ${mission.name}">${mission.status === "available" ? 'Start Mission' : 'In Progress'}</button>
        `;
        missionsListDiv.appendChild(missionDiv);
        document.getElementById(`mission-${mission.id}`).addEventListener('click', () => startMission(mission.id));
    });
}

// Determine if Mission Can Be Started
function canStartMission(mission) {
    return mission.status === "available" && gold >= mission.conquerCost.gold && soldiers >= mission.conquerCost.soldiers;
}

// Start Mission
function startMission(id) {
    const mission = missions.find(m => m.id === id);
    if (canStartMission(mission)) {
        // Deduct resources
        gold -= mission.conquerCost.gold;
        soldiers -= mission.conquerCost.soldiers;
        mission.status = "in-progress";
        playSound(missionSound);
        showToast(`Mission "${mission.name}" started!`);
        renderMissions();
        updateDisplay();
        saveGame();
        
        // Simulate mission duration (e.g., 5 seconds for demo; adjust as needed)
        setTimeout(() => {
            mission.status = "completed";
            gold += mission.reward.gold;
            prestigePoints += mission.reward.prestige;
            playSound(missionSound);
            showToast(`Mission "${mission.name}" completed! Reward: ${mission.reward.gold} Gold, ${mission.reward.prestige} Prestige Points.`);
            renderMissions();
            updateDisplay();
            saveGame();
        }, 5000);
    } else {
        showToast("Cannot start this mission. Check resources or mission status.", "error");
    }
}

// Render Achievements
function renderAchievements() {
    achievementsDiv.innerHTML = '<h3>Your Achievements</h3>';
    achievements.forEach((ach, index) => {
        const achDiv = document.createElement('div');
        achDiv.classList.add('achievement');
        achDiv.innerHTML = `
            <h4>${ach.name}</h4>
            <p>${ach.description}</p>
            <p>Status: ${ach.unlocked ? "Unlocked" : "Locked"}</p>
        `;
        achievementsDiv.appendChild(achDiv);
    });
}

// Check and Unlock Achievements
function checkAchievements() {
    achievements.forEach((ach, index) => {
        if (!ach.unlocked) {
            if (
                (ach.name === "First Recruit" && soldiers >= 1) ||
                (ach.name === "Recruit Master" && soldiers >= 100) ||
                (ach.name === "Wealthy Commander" && gold >= 1000) ||
                (ach.name === "Economic Genius" && faction === "Romans") ||
                (ach.name === "Agricultural Expert" && faction === "Egyptians") ||
                (ach.name === "Warrior Spirit" && faction === "Gauls") ||
                (ach.name === "Viking Raider" && faction === "Vikings") ||
                (ach.name === "Spartan Shield" && faction === "Spartans") ||
                (ach.name === "Mongol Conqueror" && faction === "Mongols") ||
                (ach.name === "Mission Master" && missions.filter(m => m.status === "completed").length >= 5) ||
                (ach.name === "Territory Holder" && territories.filter(t => t.owner === "Player").length >= 3)
            ) {
                ach.unlocked = true;
                playSound(upgradeSound); // Reusing upgrade sound for achievements
                showToast(`Achievement Unlocked: ${ach.name}!`);
                updateDisplay();
            }
        }
    });
}

// Show Achievement Unlock Notification
function showAchievementUnlock(achievement) {
    const notification = document.createElement('div');
    notification.classList.add('achievement-unlock');
    notification.textContent = `Achievement Unlocked: ${achievement.name}!`;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Apply Territory Bonuses
function applyTerritoryBonuses() {
    // Territory bonuses are already applied in updateDisplay()
    // If additional logic is needed, implement here
}

// Apply Building Bonuses
function applyBuildingBonuses() {
    // Implement if buildings provide continuous bonuses or other effects
    // Example: If Barracks increase soldiers' effectiveness, implement here
}

// Render Research Tree
function renderResearchTree() {
    researchTreeDiv.innerHTML = '<h3>Research & Technology</h3>';
    research.forEach(item => {
        const researchDiv = document.createElement('div');
        researchDiv.classList.add('research-item');
        researchDiv.innerHTML = `
            <h4>${item.name}</h4>
            <p>${item.description}</p>
            <p>Cost: ${item.cost.prestige} Prestige Points</p>
            <button id="research-${item.id}" ${prestigePoints < item.cost.prestige || item.unlocked ? 'disabled' : ''} aria-label="Unlock ${item.name}">${prestigePoints < item.cost.prestige || item.unlocked ? 'Locked' : 'Unlock'}</button>
        `;
        researchTreeDiv.appendChild(researchDiv);
        document.getElementById(`research-${item.id}`).addEventListener('click', () => unlockResearch(item.id));
    });
}

// Apply Research Bonuses
function applyResearchBonus(item) {
    switch (item.name) {
        case "Basic Tactics":
            goldPerClick = Math.floor(goldPerClick * 1.10);
            showToast(`Basic Tactics Research: Gold per click increased by 10%.`);
            break;
        case "Advanced Warfare":
            goldPerSecond = Math.floor(goldPerSecond * 1.20);
            showToast(`Advanced Warfare Research: Gold per second increased by 20%.`);
            break;
        case "Resource Management":
            // Reduce all upgrade costs by 10%
            for (const category in upgrades) {
                if (upgrades.hasOwnProperty(category)) {
                    upgrades[category].forEach(upg => {
                        upg.cost = Math.floor(upg.cost * 0.90);
                    });
                }
            }
            renderArmyUpgrades();
            renderEconomyUpgrades();
            showToast(`Resource Management Research: Upgrade costs reduced by 10%.`);
            break;
        // Add more research cases as needed
        default:
            break;
    }
}

// Render Buildings
function renderBuildings() {
    buildingsListDiv.innerHTML = '<h3>Buildings</h3>';
    buildings.forEach(building => {
        const buildingDiv = document.createElement('div');
        buildingDiv.classList.add('building');
        buildingDiv.innerHTML = `
            <h4>${building.name} (Level ${building.level})</h4>
            <p>${building.description}</p>
            <p>Cost: ${building.cost.gold} Gold</p>
            <button id="building-${building.id}" ${gold < building.cost.gold ? 'disabled' : ''} aria-label="Construct ${building.name}">${gold < building.cost.gold ? 'Locked' : 'Construct'}</button>
        `;
        buildingsListDiv.appendChild(buildingDiv);
        document.getElementById(`building-${building.id}`).addEventListener('click', () => buildBuilding(building.id));
    });
}

// Build Building
function buildBuilding(id) {
    const building = buildings.find(b => b.id === id);
    if (gold >= building.cost.gold) {
        gold -= building.cost.gold;
        building.level += 1;
        applyBuildingBonus(building);
        playSound(buildingSound);
        showToast(`Constructed ${building.name} (Level ${building.level}).`);
        updateDisplay();
        renderBuildings();
        saveGame();
    } else {
        showToast("Not enough gold to construct this building!", "error");
    }
}

// Apply Building Bonuses
function applyBuildingBonus(building) {
    switch (building.name) {
        case "Barracks":
            // Example: Increase soldiers' effectiveness
            goldPerClick = Math.floor(goldPerClick * 1.05); // +5% per level
            showToast(`Barracks Level ${building.level}: Gold per click increased by 5%.`);
            break;
        case "Farm":
            // Increase food per second by 5 per level
            food += 5;
            showToast(`Farm Level ${building.level}: Food increased by 5.`);
            break;
        case "Forge":
            // Increase shield per second by 2 per level
            shield += 2;
            showToast(`Forge Level ${building.level}: Shield increased by 2.`);
            break;
        // Add more building cases as needed
        default:
            break;
    }
}

// Render Missions
function renderMissions() {
    missionsListDiv.innerHTML = '<h3>Available Missions</h3>';
    missions.forEach(mission => {
        const missionDiv = document.createElement('div');
        missionDiv.classList.add('mission');
        missionDiv.innerHTML = `
            <h4>${mission.name}</h4>
            <p>${mission.description}</p>
            <p>Reward: ${mission.reward.gold} Gold, ${mission.reward.prestige} Prestige Points</p>
            <button id="mission-${mission.id}" ${canStartMission(mission) ? '' : 'disabled'} aria-label="Start ${mission.name}">${mission.status === "available" ? 'Start Mission' : 'In Progress'}</button>
        `;
        missionsListDiv.appendChild(missionDiv);
        document.getElementById(`mission-${mission.id}`).addEventListener('click', () => startMission(mission.id));
    });
}

// Determine if Mission Can Be Started
function canStartMission(mission) {
    return mission.status === "available" && gold >= mission.conquerCost.gold && soldiers >= mission.conquerCost.soldiers;
}

// Start Mission
function startMission(id) {
    const mission = missions.find(m => m.id === id);
    if (canStartMission(mission)) {
        // Deduct resources
        gold -= mission.conquerCost.gold;
        soldiers -= mission.conquerCost.soldiers;
        mission.status = "in-progress";
        playSound(missionSound);
        showToast(`Mission "${mission.name}" started!`);
        renderMissions();
        updateDisplay();
        saveGame();
        
        // Simulate mission duration (e.g., 5 seconds for demo; adjust as needed)
        setTimeout(() => {
            mission.status = "completed";
            gold += mission.reward.gold;
            prestigePoints += mission.reward.prestige;
            playSound(missionSound);
            showToast(`Mission "${mission.name}" completed! Reward: ${mission.reward.gold} Gold, ${mission.reward.prestige} Prestige Points.`);
            renderMissions();
            updateDisplay();
            saveGame();
        }, 5000);
    } else {
        showToast("Cannot start this mission. Check resources or mission status.", "error");
    }
}

// Render Achievements
function renderAchievements() {
    achievementsDiv.innerHTML = '<h3>Your Achievements</h3>';
    achievements.forEach((ach, index) => {
        const achDiv = document.createElement('div');
        achDiv.classList.add('achievement');
        achDiv.innerHTML = `
            <h4>${ach.name}</h4>
            <p>${ach.description}</p>
            <p>Status: ${ach.unlocked ? "Unlocked" : "Locked"}</p>
        `;
        achievementsDiv.appendChild(achDiv);
    });
}

// Check and Unlock Achievements
function checkAchievements() {
    achievements.forEach((ach, index) => {
        if (!ach.unlocked) {
            if (
                (ach.name === "First Recruit" && soldiers >= 1) ||
                (ach.name === "Recruit Master" && soldiers >= 100) ||
                (ach.name === "Wealthy Commander" && gold >= 1000) ||
                (ach.name === "Economic Genius" && faction === "Romans") ||
                (ach.name === "Agricultural Expert" && faction === "Egyptians") ||
                (ach.name === "Warrior Spirit" && faction === "Gauls") ||
                (ach.name === "Viking Raider" && faction === "Vikings") ||
                (ach.name === "Spartan Shield" && faction === "Spartans") ||
                (ach.name === "Mongol Conqueror" && faction === "Mongols") ||
                (ach.name === "Mission Master" && missions.filter(m => m.status === "completed").length >= 5) ||
                (ach.name === "Territory Holder" && territories.filter(t => t.owner === "Player").length >= 3)
            ) {
                ach.unlocked = true;
                playSound(upgradeSound); // Reusing upgrade sound for achievements
                showToast(`Achievement Unlocked: ${ach.name}!`);
                updateDisplay();
            }
        }
    });
}

// Show Achievement Unlock Notification
function showAchievementUnlock(achievement) {
    const notification = document.createElement('div');
    notification.classList.add('achievement-unlock');
    notification.textContent = `Achievement Unlocked: ${achievement.name}!`;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Apply Territory Bonuses
function applyTerritoryBonuses() {
    // Territory bonuses are already applied in updateDisplay()
    // If additional logic is needed, implement here
}

// Apply Building Bonuses
function applyBuildingBonuses() {
    // Implement if buildings provide continuous bonuses or other effects
    // Example: If Barracks increase soldiers' effectiveness, implement here
}

// Render Research Tree
function renderResearchTree() {
    researchTreeDiv.innerHTML = '<h3>Research & Technology</h3>';
    research.forEach(item => {
        const researchDiv = document.createElement('div');
        researchDiv.classList.add('research-item');
        researchDiv.innerHTML = `
            <h4>${item.name}</h4>
            <p>${item.description}</p>
            <p>Cost: ${item.cost.prestige} Prestige Points</p>
            <button id="research-${item.id}" ${prestigePoints < item.cost.prestige || item.unlocked ? 'disabled' : ''} aria-label="Unlock ${item.name}">${prestigePoints < item.cost.prestige || item.unlocked ? 'Locked' : 'Unlock'}</button>
        `;
        researchTreeDiv.appendChild(researchDiv);
        document.getElementById(`research-${item.id}`).addEventListener('click', () => unlockResearch(item.id));
    });
}

// Apply Research Bonuses
function applyResearchBonus(item) {
    switch (item.name) {
        case "Basic Tactics":
            goldPerClick = Math.floor(goldPerClick * 1.10);
            showToast(`Basic Tactics Research: Gold per click increased by 10%.`);
            break;
        case "Advanced Warfare":
            goldPerSecond = Math.floor(goldPerSecond * 1.20);
            showToast(`Advanced Warfare Research: Gold per second increased by 20%.`);
            break;
        case "Resource Management":
            // Reduce all upgrade costs by 10%
            for (const category in upgrades) {
                if (upgrades.hasOwnProperty(category)) {
                    upgrades[category].forEach(upg => {
                        upg.cost = Math.floor(upg.cost * 0.90);
                    });
                }
            }
            renderArmyUpgrades();
            renderEconomyUpgrades();
            showToast(`Resource Management Research: Upgrade costs reduced by 10%.`);
            break;
        // Add more research cases as needed
        default:
            break;
    }
}

// Render Buildings
function renderBuildings() {
    buildingsListDiv.innerHTML = '<h3>Buildings</h3>';
    buildings.forEach(building => {
        const buildingDiv = document.createElement('div');
        buildingDiv.classList.add('building');
        buildingDiv.innerHTML = `
            <h4>${building.name} (Level ${building.level})</h4>
            <p>${building.description}</p>
            <p>Cost: ${building.cost.gold} Gold</p>
            <button id="building-${building.id}" ${gold < building.cost.gold ? 'disabled' : ''} aria-label="Construct ${building.name}">${gold < building.cost.gold ? 'Locked' : 'Construct'}</button>
        `;
        buildingsListDiv.appendChild(buildingDiv);
        document.getElementById(`building-${building.id}`).addEventListener('click', () => buildBuilding(building.id));
    });
}

// Build Building
function buildBuilding(id) {
    const building = buildings.find(b => b.id === id);
    if (gold >= building.cost.gold) {
        gold -= building.cost.gold;
        building.level += 1;
        applyBuildingBonus(building);
        playSound(buildingSound);
        showToast(`Constructed ${building.name} (Level ${building.level}).`);
        updateDisplay();
        renderBuildings();
        saveGame();
    } else {
        showToast("Not enough gold to construct this building!", "error");
    }
}

// Apply Building Bonuses
function applyBuildingBonus(building) {
    switch (building.name) {
        case "Barracks":
            // Example: Increase soldiers' effectiveness
            goldPerClick = Math.floor(goldPerClick * 1.05); // +5% per level
            showToast(`Barracks Level ${building.level}: Gold per click increased by 5%.`);
            break;
        case "Farm":
            // Increase food per second by 5 per level
            food += 5;
            showToast(`Farm Level ${building.level}: Food increased by 5.`);
            break;
        case "Forge":
            // Increase shield per second by 2 per level
            shield += 2;
            showToast(`Forge Level ${building.level}: Shield increased by 2.`);
            break;
        // Add more building cases as needed
        default:
            break;
    }
}

// Render Missions
function renderMissions() {
    missionsListDiv.innerHTML = '<h3>Available Missions</h3>';
    missions.forEach(mission => {
        const missionDiv = document.createElement('div');
        missionDiv.classList.add('mission');
        missionDiv.innerHTML = `
            <h4>${mission.name}</h4>
            <p>${mission.description}</p>
            <p>Reward: ${mission.reward.gold} Gold, ${mission.reward.prestige} Prestige Points</p>
            <button id="mission-${mission.id}" ${canStartMission(mission) ? '' : 'disabled'} aria-label="Start ${mission.name}">${mission.status === "available" ? 'Start Mission' : 'In Progress'}</button>
        `;
        missionsListDiv.appendChild(missionDiv);
        document.getElementById(`mission-${mission.id}`).addEventListener('click', () => startMission(mission.id));
    });
}

// Determine if Mission Can Be Started
function canStartMission(mission) {
    return mission.status === "available" && gold >= mission.conquerCost.gold && soldiers >= mission.conquerCost.soldiers;
}

// Start Mission
function startMission(id) {
    const mission = missions.find(m => m.id === id);
    if (canStartMission(mission)) {
        // Deduct resources
        gold -= mission.conquerCost.gold;
        soldiers -= mission.conquerCost.soldiers;
        mission.status = "in-progress";
        playSound(missionSound);
        showToast(`Mission "${mission.name}" started!`);
        renderMissions();
        updateDisplay();
        saveGame();
        
        // Simulate mission duration (e.g., 5 seconds for demo; adjust as needed)
        setTimeout(() => {
            mission.status = "completed";
            gold += mission.reward.gold;
            prestigePoints += mission.reward.prestige;
            playSound(missionSound);
            showToast(`Mission "${mission.name}" completed! Reward: ${mission.reward.gold} Gold, ${mission.reward.prestige} Prestige Points.`);
            renderMissions();
            updateDisplay();
            saveGame();
        }, 5000);
    } else {
        showToast("Cannot start this mission. Check resources or mission status.", "error");
    }
}

// Render Achievements
function renderAchievements() {
    achievementsDiv.innerHTML = '<h3>Your Achievements</h3>';
    achievements.forEach((ach, index) => {
        const achDiv = document.createElement('div');
        achDiv.classList.add('achievement');
        achDiv.innerHTML = `
            <h4>${ach.name}</h4>
            <p>${ach.description}</p>
            <p>Status: ${ach.unlocked ? "Unlocked" : "Locked"}</p>
        `;
        achievementsDiv.appendChild(achDiv);
    });
}

// Check and Unlock Achievements
function checkAchievements() {
    achievements.forEach((ach, index) => {
        if (!ach.unlocked) {
            if (
                (ach.name === "First Recruit" && soldiers >= 1) ||
                (ach.name === "Recruit Master" && soldiers >= 100) ||
                (ach.name === "Wealthy Commander" && gold >= 1000) ||
                (ach.name === "Economic Genius" && faction === "Romans") ||
                (ach.name === "Agricultural Expert" && faction === "Egyptians") ||
                (ach.name === "Warrior Spirit" && faction === "Gauls") ||
                (ach.name === "Viking Raider" && faction === "Vikings") ||
                (ach.name === "Spartan Shield" && faction === "Spartans") ||
                (ach.name === "Mongol Conqueror" && faction === "Mongols") ||
                (ach.name === "Mission Master" && missions.filter(m => m.status === "completed").length >= 5) ||
                (ach.name === "Territory Holder" && territories.filter(t => t.owner === "Player").length >= 3)
            ) {
                ach.unlocked = true;
                playSound(upgradeSound); // Reusing upgrade sound for achievements
                showToast(`Achievement Unlocked: ${ach.name}!`);
                updateDisplay();
            }
        }
    });
}

// Show Toast Notification
function showToast(message, type = "success") {
    const toast = document.createElement('div');
    toast.classList.add('toast');
    if (type === "error") {
        toast.style.backgroundColor = '#f44336'; // Red for errors
    }
    toast.textContent = message;
    toastContainer.appendChild(toast);
    
    // Remove toast after animation
    setTimeout(() => {
        toast.remove();
    }, 4000);
}

// Play Sound Helper
function playSound(sound) {
    if (!muteCheckbox.checked) {
        sound.currentTime = 0;
        sound.play();
    }
}

// Save Game State
function saveGame() {
    const gameState = {
        gold,
        food,
        soldiers,
        shield,
        prestigePoints,
        faction,
        goldPerClick,
        goldPerSecond,
        upgrades,
        achievements,
        territories,
        research,
        buildings,
        missions
    };
    localStorage.setItem('armyIdleGame', JSON.stringify(gameState));
}

// Load Game State
function loadGame() {
    const savedState = localStorage.getItem('armyIdleGame');
    if (savedState) {
        const gameState = JSON.parse(savedState);
        gold = gameState.gold;
        food = gameState.food;
        soldiers = gameState.soldiers;
        shield = gameState.shield;
        prestigePoints = gameState.prestigePoints;
        faction = gameState.faction;
        goldPerClick = gameState.goldPerClick;
        goldPerSecond = gameState.goldPerSecond;
        // Load upgrades
        for (const category in upgrades) {
            if (upgrades.hasOwnProperty(category)) {
                upgrades[category].forEach(upg => {
                    const savedUpgrade = gameState.upgrades[category].find(su => su.name === upg.name);
                    if (savedUpgrade) {
                        upg.owned = savedUpgrade.owned;
                        upg.cost = savedUpgrade.cost;
                        goldPerSecond += upg.goldPerSecond * upg.owned;
                    }
                });
            }
        }
        // Load achievements
        gameState.achievements.forEach(savedAch => {
            const ach = achievements.find(a => a.name === savedAch.name);
            if (ach) ach.unlocked = savedAch.unlocked;
        });
        // Load territories
        gameState.territories.forEach(savedTerritory => {
            const territory = territories.find(t => t.id === savedTerritory.id);
            if (territory) {
                territory.owner = savedTerritory.owner;
            }
        });
        // Load research
        gameState.research.forEach(savedResearch => {
            const researchItem = research.find(r => r.id === savedResearch.id);
            if (researchItem) {
                researchItem.unlocked = savedResearch.unlocked;
            }
        });
        // Load buildings
        gameState.buildings.forEach(savedBuilding => {
            const building = buildings.find(b => b.id === savedBuilding.id);
            if (building) {
                building.level = savedBuilding.level;
            }
        });
        // Load missions
        gameState.missions.forEach(savedMission => {
            const mission = missions.find(m => m.id === savedMission.id);
            if (mission) {
                mission.status = savedMission.status;
            }
        });
        // Apply faction bonus if already selected
        if (faction) {
            applyFactionBonus();
        }
    }
}

// Setup Tab Navigation
function setupTabNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            switchTab(item);
        });
        
        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                switchTab(item);
            }
        });
    });
}

// Switch Tab Function
function switchTab(selectedTab) {
    const navItems = document.querySelectorAll('.nav-item');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    // Remove active class from all nav items
    navItems.forEach(nav => {
        nav.classList.remove('active');
        nav.setAttribute('aria-selected', 'false');
    });
    // Add active class to clicked nav item
    selectedTab.classList.add('active');
    selectedTab.setAttribute('aria-selected', 'true');
    // Hide all tab panes
    tabPanes.forEach(pane => pane.classList.remove('active'));
    // Show the selected tab pane
    const selectedTabId = selectedTab.getAttribute('data-tab');
    const activePane = document.getElementById(selectedTabId);
    if (activePane) {
        activePane.classList.add('active');
    }
}

// Setup Keyboard Navigation
function setupKeyboardNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.setAttribute('tabindex', '0');
    });
}

// Setup Auto Generators
function setupAutoGenerators() {
    setInterval(() => {
        gold += goldPerSecond;
        updateDisplay();
        saveGame();
    }, 1000);
}

// Choose Faction
function chooseFaction(selectedFaction) {
    faction = selectedFaction;
    applyFactionBonus();
    document.querySelector('.faction-selection').style.display = 'none';
    updateDisplay();
    renderTerritories();
    saveGame();
    showToast(`You have chosen the ${faction}!`);
}

// Apply Faction Bonuses
function applyFactionBonus() {
    switch (faction) {
        case "Romans":
            // Public Order/Economic Benefit: Increase gold per second by 10%
            goldPerSecond = Math.floor(goldPerSecond * 1.10);
            showToast(`Faction Bonus: Gold per second increased by 10%.`);
            break;
        case "Egyptians":
            // Food Benefit: Gain 5 Food per second
            setInterval(() => {
                food += 5;
                updateDisplay();
                saveGame();
            }, 1000);
            showToast(`Faction Bonus: Food increased by 5 per second.`);
            break;
        case "Gauls":
            // Military Bonus: Increase gold per click by 20%
            goldPerClick = Math.floor(goldPerClick * 1.20);
            showToast(`Faction Bonus: Gold per click increased by 20%.`);
            break;
        case "Vikings":
            // Increased soldiers' efficiency: Each soldier generates 20% more gold per click
            goldPerClick = Math.floor(goldPerClick * 1.20);
            showToast(`Faction Bonus: Gold per click increased by 20%.`);
            break;
        case "Spartans":
            // Enhanced defensive capabilities: Generate a shield resource that provides passive bonuses
            setInterval(() => {
                shield += 1;
                updateDisplay();
                saveGame();
            }, 1000);
            showToast(`Faction Bonus: Shield increased by 1 per second.`);
            break;
        case "Mongols":
            // Rapid resource generation: Increase gold per second by 15%
            goldPerSecond = Math.floor(goldPerSecond * 1.15);
            showToast(`Faction Bonus: Gold per second increased by 15%.`);
            break;
        default:
            break;
    }
}

// Event Listeners for Faction Buttons
factionButtons.forEach(button => {
    button.addEventListener('click', () => {
        const selectedFaction = button.getAttribute('data-faction');
        chooseFaction(selectedFaction);
    });
});

// Prestige Function
function prestige() {
    if (gold >= 1000) { // Minimum requirement to prestige
        const earnedPrestigePoints = Math.floor(gold / 1000);
        prestigePoints += earnedPrestigePoints;
        playSound(prestigeSound);
        showToast(`You have prestiged and earned ${earnedPrestigePoints} Prestige Points! Choose your faction.`);
        // Reset game variables except prestigePoints and faction
        gold = 0;
        food = 0;
        soldiers = 0;
        shield = 0; // Reset shield
        goldPerClick = 1;
        goldPerSecond = 0;
        // Reset upgrades
        for (const category in upgrades) {
            if (upgrades.hasOwnProperty(category)) {
                upgrades[category].forEach(upg => {
                    upg.owned = 0;
                    upg.cost = upg.originalCost;
                });
            }
        }
        // Reset territories to neutral
        territories.forEach(territory => { territory.owner = "Neutral"; });
        // Reset missions
        missions.forEach(mission => { mission.status = "available"; });
        // Reset buildings
        buildings.forEach(building => { building.level = 0; });
        // Reset research
        research.forEach(item => { item.unlocked = false; });
        // Show faction selection
        document.querySelector('.faction-selection').style.display = 'flex';
        updateDisplay();
        renderTerritories();
        renderResearchTree();
        renderBuildings();
        renderMissions();
        saveGame();
    } else {
        showToast("You need at least 1000 Gold to prestige!", "error");
    }
}

// Handle Prestige Button Click
if (prestigeButton) {
    prestigeButton.addEventListener('click', prestige);
}

// Show Toast Notification
function showToast(message, type = "success") {
    const toast = document.createElement('div');
    toast.classList.add('toast');
    if (type === "error") {
        toast.style.backgroundColor = '#f44336'; // Red for errors
    }
    toast.textContent = message;
    toastContainer.appendChild(toast);
    
    // Remove toast after animation
    setTimeout(() => {
        toast.remove();
    }, 4000);
}

// Choose Faction
// (Function already defined above)

// Initialize the Game
init();
