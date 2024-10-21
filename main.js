// main.js
import { gameState } from './gameState.js';
import { playSound, showToast, capitalizeFirstLetter } from './utils.js';
import { Territory, Building } from './entities.js';

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

// Sound Effects
const sounds = {
    click: new Audio('assets/sounds/click.mp3'),
    upgrade: new Audio('assets/sounds/upgrade.mp3'),
    prestige: new Audio('assets/sounds/prestige.mp3'),
    conquer: new Audio('assets/sounds/conquer.mp3'),
    mission: new Audio('assets/sounds/mission.mp3'),
    research: new Audio('assets/sounds/research.mp3'),
    building: new Audio('assets/sounds/building.mp3'),
};

// Game Initialization
function init() {
    loadGame();
    updateDisplay();
    renderAll();
    setupEventListeners();
    setupAutoGenerators();
}

function updateDisplay() {
    goldSpan.textContent = gameState.resources.gold;
    foodSpan.textContent = gameState.resources.food;
    soldiersSpan.textContent = gameState.resources.soldiers;
    shieldSpan.textContent = gameState.resources.shield;
    prestigePointsSpan.textContent = gameState.resources.prestigePoints;
    checkAchievements();
}

function renderAll() {
    renderUpgrades('army', armyUpgradesDiv);
    renderUpgrades('economy', economyUpgradesDiv);
    renderAchievements();
    renderTerritories();
    renderResearchTree();
    renderBuildings();
    renderMissions();
}

// Event Listeners Setup
function setupEventListeners() {
    recruitButton.addEventListener('click', recruitSoldiers);
    prestigeButton.addEventListener('click', prestige);
    factionButtons.forEach(button => {
        button.addEventListener('click', () => {
            const selectedFaction = button.getAttribute('data-faction');
            chooseFaction(selectedFaction);
        });
    });
    // Mute checkbox
    muteCheckbox.addEventListener('change', () => {
        // Handle mute toggle if needed
    });
}

// Recruit Soldiers
function recruitSoldiers() {
    gameState.resources.soldiers += 1;
    gameState.resources.gold += gameState.goldPerClick;
    playSound(sounds.click, muteCheckbox.checked);
    showToast(`Recruited 1 soldier. Gold increased by ${gameState.goldPerClick}.`);
    updateDisplay();
    saveGame();
}

// Render Upgrades
function renderUpgrades(category, containerDiv) {
    containerDiv.innerHTML = `<h3>${capitalizeFirstLetter(category)} Upgrades</h3>`;
    gameState.upgrades[category].forEach((upgrade, index) => {
        const upgradeDiv = document.createElement('div');
        upgradeDiv.classList.add('upgrade', 'card');
        upgradeDiv.innerHTML = `
            <h4>${upgrade.name}</h4>
            <p>Cost: ${upgrade.cost} Gold</p>
            <p>Generates: ${upgrade.goldPerSecond} Gold/sec</p>
            <p>Owned: ${upgrade.owned}</p>
            <button class="upgrade-button" data-category="${category}" data-index="${index}" ${gameState.resources.gold < upgrade.cost ? 'disabled' : ''} aria-label="Buy ${upgrade.name}">${gameState.resources.gold < upgrade.cost ? 'Locked' : 'Buy'}</button>
        `;
        containerDiv.appendChild(upgradeDiv);
    });
}

// Buy Upgrade
function buyUpgrade(category, index) {
    const upgrade = gameState.upgrades[category][index];
    if (gameState.resources.gold >= upgrade.cost) {
        gameState.resources.gold -= upgrade.cost;
        gameState.goldPerSecond += upgrade.goldPerSecond;
        upgrade.owned += 1;
        // Increase the cost for next purchase
        upgrade.cost = Math.floor(upgrade.cost * 1.5);
        playSound(sounds.upgrade, muteCheckbox.checked);
        showToast(`Purchased ${upgrade.name}. Gold/sec increased by ${upgrade.goldPerSecond}.`);
        updateDisplay();
        renderUpgrades(category, category === 'army' ? armyUpgradesDiv : economyUpgradesDiv);
        saveGame();
    } else {
        showToast("Not enough gold to buy this upgrade!", "error");
    }
}

// Render Territories
function renderTerritories() {
    territoriesDiv.innerHTML = '<h3>Your Territories</h3>';
    gameState.territories.forEach(territoryData => {
        const territory = new Territory(territoryData);
        const territoryDiv = document.createElement('div');
        territoryDiv.classList.add('territory', 'card');
        territoryDiv.innerHTML = `
            <i class="fas fa-map-marker-alt territory-icon"></i>
            <div class="territory-name">${territory.name}</div>
            <div class="territory-owner">Owner: ${territory.owner}</div>
            <div class="territory-bonus">Bonus: ${formatBonus(territory.bonus)}</div>
            <button class="conquer-button" data-id="${territory.id}" ${territory.canConquer(gameState.resources) ? '' : 'disabled'} aria-label="Conquer ${territory.name}">
                <i class="fas fa-bullseye"></i> Conquer
            </button>
        `;
        territoriesDiv.appendChild(territoryDiv);
    });
}

// Conquer Territory
function conquerTerritory(id) {
    const territoryData = gameState.territories.find(t => t.id === id);
    const territory = new Territory(territoryData);
    if (territory.attemptConquer(gameState.resources)) {
        playSound(sounds.conquer, muteCheckbox.checked);
        showToast(`Successfully conquered ${territory.name}!`);
    } else {
        showToast(`Failed to conquer ${territory.name}. Try again!`, "error");
    }
    updateDisplay();
    renderTerritories();
    saveGame();
}

// Render Achievements
function renderAchievements() {
    achievementsDiv.innerHTML = '<h3>Your Achievements</h3>';
    gameState.achievements.forEach(achievement => {
        const achDiv = document.createElement('div');
        achDiv.classList.add('achievement', 'card');
        achDiv.innerHTML = `
            <h4>${achievement.name}</h4>
            <p>${achievement.description}</p>
            <p>Status: ${achievement.unlocked ? "Unlocked" : "Locked"}</p>
        `;
        achievementsDiv.appendChild(achDiv);
    });
}

// Check Achievements
function checkAchievements() {
    gameState.achievements.forEach(achievement => {
        if (!achievement.unlocked) {
            if (achievementCriteriaMet(achievement)) {
                achievement.unlocked = true;
                playSound(sounds.upgrade, muteCheckbox.checked);
                showToast(`Achievement Unlocked: ${achievement.name}!`);
                renderAchievements();
                saveGame();
            }
        }
    });
}

// Achievement Criteria
function achievementCriteriaMet(achievement) {
    switch (achievement.name) {
        case "First Recruit":
            return gameState.resources.soldiers >= 1;
        // Add other cases
        default:
            return false;
    }
}

// Render Buildings
function renderBuildings() {
    buildingsListDiv.innerHTML = '<h3>Buildings</h3>';
    gameState.buildings.forEach(buildingData => {
        const building = new Building(buildingData);
        const buildingDiv = document.createElement('div');
        buildingDiv.classList.add('building', 'card');
        buildingDiv.innerHTML = `
            <h4>${building.name} (Level ${building.level})</h4>
            <p>${building.description}</p>
            <p>Cost: ${building.cost.gold} Gold</p>
            <button class="build-button" data-id="${building.id}" ${building.canBuild(gameState.resources) ? '' : 'disabled'} aria-label="Construct ${building.name}">${building.canBuild(gameState.resources) ? 'Construct' : 'Locked'}</button>
        `;
        buildingsListDiv.appendChild(buildingDiv);
    });
}

// Build Building
function buildBuilding(id) {
    const buildingData = gameState.buildings.find(b => b.id === id);
    const building = new Building(buildingData);
    if (building.build(gameState.resources)) {
        applyBuildingBonus(building);
        playSound(sounds.building, muteCheckbox.checked);
        showToast(`Constructed ${building.name} (Level ${building.level}).`);
        updateDisplay();
        renderBuildings();
        saveGame();
    } else {
        showToast("Not enough gold to construct this building!", "error");
    }
}

// Apply Building Bonus
function applyBuildingBonus(building) {
    switch (building.name) {
        case "Barracks":
            gameState.goldPerClick = Math.floor(gameState.goldPerClick * 1.05);
            break;
        // Add other cases
    }
}

// Render Research Tree
function renderResearchTree() {
    researchTreeDiv.innerHTML = '<h3>Research & Technology</h3>';
    gameState.research.forEach(item => {
        const researchDiv = document.createElement('div');
        researchDiv.classList.add('research-item', 'card');
        researchDiv.innerHTML = `
            <h4>${item.name}</h4>
            <p>${item.description}</p>
            <p>Cost: ${item.cost.prestige} Prestige Points</p>
            <button class="research-button" data-id="${item.id}" ${gameState.resources.prestigePoints < item.cost.prestige || item.unlocked ? 'disabled' : ''} aria-label="Unlock ${item.name}">${item.unlocked ? 'Unlocked' : 'Unlock'}</button>
        `;
        researchTreeDiv.appendChild(researchDiv);
    });
}

// Unlock Research
function unlockResearch(id) {
    const item = gameState.research.find(r => r.id === id);
    if (gameState.resources.prestigePoints >= item.cost.prestige && !item.unlocked) {
        gameState.resources.prestigePoints -= item.cost.prestige;
        item.unlocked = true;
        applyResearchBonus(item);
        playSound(sounds.research, muteCheckbox.checked);
        showToast(`Unlocked Research: ${item.name}`);
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
            gameState.goldPerClick = Math.floor(gameState.goldPerClick * 1.10);
            break;
        // Add other cases
    }
}

// Render Missions
function renderMissions() {
    missionsListDiv.innerHTML = '<h3>Available Missions</h3>';
    gameState.missions.forEach(mission => {
        const missionDiv = document.createElement('div');
        missionDiv.classList.add('mission', 'card');
        missionDiv.innerHTML = `
            <h4>${mission.name}</h4>
            <p>${mission.description}</p>
            <p>Reward: ${mission.reward.gold} Gold, ${mission.reward.prestige} Prestige Points</p>
            <button class="mission-button" data-id="${mission.id}" ${mission.status === 'available' ? '' : 'disabled'} aria-label="Start ${mission.name}">${mission.status === 'available' ? 'Start Mission' : 'In Progress'}</button>
        `;
        missionsListDiv.appendChild(missionDiv);
    });
}

// Start Mission
function startMission(id) {
    const mission = gameState.missions.find(m => m.id === id);
    if (mission.status === 'available' && gameState.resources.gold >= mission.reward.gold && gameState.resources.soldiers >= mission.reward.soldiers) {
        gameState.resources.gold -= mission.reward.gold;
        gameState.resources.soldiers -= mission.reward.soldiers;
        mission.status = 'in-progress';
        playSound(sounds.mission, muteCheckbox.checked);
        showToast(`Mission "${mission.name}" started!`);
        updateDisplay();
        renderMissions();
        saveGame();

        // Simulate mission duration
        setTimeout(() => {
            mission.status = 'completed';
            gameState.resources.gold += mission.reward.gold;
            gameState.resources.prestigePoints += mission.reward.prestige;
            playSound(sounds.mission, muteCheckbox.checked);
            showToast(`Mission "${mission.name}" completed! Reward: ${mission.reward.gold} Gold, ${mission.reward.prestige} Prestige Points.`);
            renderMissions();
            updateDisplay();
            saveGame();
        }, 5000);
    } else {
        showToast("Cannot start this mission. Check resources or mission status.", "error");
    }
}

// Prestige Function
function prestige() {
    if (gameState.resources.gold >= 1000) {
        const earnedPrestigePoints = Math.floor(gameState.resources.gold / 1000);
        gameState.resources.prestigePoints += earnedPrestigePoints;
        playSound(sounds.prestige, muteCheckbox.checked);
        showToast(`You have prestiged and earned ${earnedPrestigePoints} Prestige Points! Choose your faction.`);
        resetGame();
        document.querySelector('.faction-selection').style.display = 'flex';
        updateDisplay();
        renderAll();
        saveGame();
    } else {
        showToast("You need at least 1000 Gold to prestige!", "error");
    }
}

// Reset Game State
function resetGame() {
    gameState.resources.gold = 0;
    gameState.resources.food = 0;
    gameState.resources.soldiers = 0;
    gameState.resources.shield = 0;
    gameState.goldPerClick = 1;
    gameState.goldPerSecond = 0;
    gameState.upgrades.army.forEach(upg => {
        upg.owned = 0;
        upg.cost = upg.originalCost;
    });
    gameState.upgrades.economy.forEach(upg => {
        upg.owned = 0;
        upg.cost = upg.originalCost;
    });
    gameState.territories.forEach(territory => {
        territory.owner = "Neutral";
    });
    gameState.buildings.forEach(building => {
        building.level = 0;
    });
    gameState.research.forEach(item => {
        item.unlocked = false;
    });
    gameState.missions.forEach(mission => {
        mission.status = 'available';
    });
}

// Choose Faction
function chooseFaction(selectedFaction) {
    gameState.faction = selectedFaction;
    applyFactionBonus();
    document.querySelector('.faction-selection').style.display = 'none';
    updateDisplay();
    renderTerritories();
    saveGame();
    showToast(`You have chosen the ${gameState.faction}!`);
}

// Apply Faction Bonuses
function applyFactionBonus() {
    switch (gameState.faction) {
        case "Romans":
            gameState.goldPerSecond = Math.floor(gameState.goldPerSecond * 1.10);
            break;
        // Add other cases
    }
}

// Auto Generators
function setupAutoGenerators() {
    setInterval(() => {
        gameState.resources.gold += gameState.goldPerSecond;
        updateDisplay();
        saveGame();
    }, 1000);
}

// Save Game
function saveGame() {
    localStorage.setItem('armyIdleGame', JSON.stringify(gameState));
}

// Load Game
function loadGame() {
    const savedState = localStorage.getItem('armyIdleGame');
    if (savedState) {
        Object.assign(gameState, JSON.parse(savedState));
    }
}

// Event Delegation for Dynamic Elements
document.addEventListener('click', (event) => {
    if (event.target.matches('.upgrade-button')) {
        const category = event.target.dataset.category;
        const index = event.target.dataset.index;
        buyUpgrade(category, index);
    } else if (event.target.matches('.conquer-button')) {
        const id = parseInt(event.target.dataset.id);
        conquerTerritory(id);
    } else if (event.target.matches('.build-button')) {
        const id = parseInt(event.target.dataset.id);
        buildBuilding(id);
    } else if (event.target.matches('.research-button')) {
        const id = parseInt(event.target.dataset.id);
        unlockResearch(id);
    } else if (event.target.matches('.mission-button')) {
        const id = parseInt(event.target.dataset.id);
        startMission(id);
    }
});

// Initialize the Game
init();
