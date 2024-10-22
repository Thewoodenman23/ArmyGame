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
const achievementsDiv = document.getElementById('achievementsDiv');
const territoriesGridDiv = document.getElementById('territoriesGrid');
const researchTreeDiv = document.getElementById('researchTree');
const buildingsListDiv = document.getElementById('buildingsList');
const missionsListDiv = document.getElementById('missionsList');
const factionButtons = document.querySelectorAll('.faction-button');

// Sound Effects
const sounds = {
    click: new Audio('assets/sounds/click.mp3'),
    upgrade: new Audio('assets/sounds/upgrade.mp3'),
    prestige: new Audio('assets/sounds/prestige.wav'),
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

// Update Display
function updateDisplay() {
    goldSpan.textContent = gameState.resources.gold;
    foodSpan.textContent = gameState.resources.food;
    soldiersSpan.textContent = gameState.resources.soldiers;
    shieldSpan.textContent = gameState.resources.shield;
    prestigePointsSpan.textContent = gameState.resources.prestigePoints;
    checkAchievements();
}

// Render All
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
}

// Recruit Soldiers
function recruitSoldiers() {
    gameState.resources.soldiers += 1;
    gameState.resources.gold += gameState.goldPerClick;
    playSound(sounds.click, false);
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
        playSound(sounds.upgrade, false);
        showToast(`Purchased ${upgrade.name}. Gold/sec increased by ${upgrade.goldPerSecond}.`);
        updateDisplay();
        renderUpgrades(category, category === 'army' ? armyUpgradesDiv : economyUpgradesDiv);
        saveGame();
    } else {
        showToast("Not enough gold to buy this upgrade!", "error");
    }
}

// Render Territories in a Grid
function renderTerritories() {
    territoriesGridDiv.innerHTML = '<h3>Your Territories</h3>';
    const maxRow = Math.max(...gameState.territories.map(t => t.gridPosition.row));
    const maxCol = Math.max(...gameState.territories.map(t => t.gridPosition.col));

    territoriesGridDiv.style.gridTemplateRows = `repeat(${maxRow}, 1fr)`;
    territoriesGridDiv.style.gridTemplateColumns = `repeat(${maxCol}, 1fr)`;

    gameState.territories.forEach(territoryData => {
        const territory = new Territory(territoryData);
        const territoryDiv = document.createElement('div');
        territoryDiv.classList.add('territory-cell');
        territoryDiv.style.gridRow = territory.gridPosition.row;
        territoryDiv.style.gridColumn = territory.gridPosition.col;

        const isOwned = territory.owner === "Player";
        const isAdjacentToPlayer = territory.adjacent.some(adjacentId =>
            gameState.playerTerritories.includes(adjacentId)
        );

        territoryDiv.innerHTML = `
            <div class="territory-name">${territory.name}</div>
            <div class="territory-owner">Owner: ${territory.owner}</div>
            <div class="territory-defense">Defense: ${territory.defense}</div>
            <button class="conquer-button" data-id="${territory.id}"
                ${territory.canConquer(gameState.resources, gameState.playerTerritories) ? '' : 'disabled'}
                aria-label="Conquer ${territory.name}">
                Conquer
            </button>
        `;

        // Apply styles based on ownership
        if (isOwned) {
            territoryDiv.classList.add('owned');
        } else if (isAdjacentToPlayer || gameState.playerTerritories.length === 0) {
            territoryDiv.classList.add('adjacent');
        } else {
            territoryDiv.classList.add('neutral');
        }

        territoriesGridDiv.appendChild(territoryDiv);
    });
}

// Conquer Territory
function conquerTerritory(id) {
    const territoryData = gameState.territories.find(t => t.id === id);
    const territory = new Territory(territoryData);

    if (territory.attemptConquer(gameState.resources, gameState.playerTerritories)) {
        territoryData.owner = "Player"; // Update the owner in gameState
        gameState.playerTerritories.push(territory.id);
        applyTerritoryBonuses();
        playSound(sounds.conquer, false);
        showToast(`Successfully conquered ${territory.name}!`);
    } else {
        showToast(`Failed to conquer ${territory.name}. Try again!`, "error");
    }
    updateDisplay();
    renderTerritories();
    saveGame();
}

// Apply Territory Bonuses
function applyTerritoryBonuses() {
    // Reset bonuses
    gameState.bonuses = { goldPerSecond: 0, foodPerSecond: 0, shieldPerSecond: 0 };

    gameState.playerTerritories.forEach(territoryId => {
        const territory = gameState.territories.find(t => t.id === territoryId);
        if (territory && territory.bonus) {
            for (const key in territory.bonus) {
                if (territory.bonus.hasOwnProperty(key)) {
                    gameState.bonuses[key] += territory.bonus[key];
                }
            }
        }
    });
}

// Update Resource Generation with Bonuses
function setupAutoGenerators() {
    setInterval(() => {
        gameState.resources.gold += gameState.goldPerSecond + gameState.bonuses.goldPerSecond;
        gameState.resources.food += gameState.bonuses.foodPerSecond;
        gameState.resources.shield += gameState.bonuses.shieldPerSecond;
        updateDisplay();
        saveGame();
    }, 1000);
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
                playSound(sounds.upgrade, false);
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
        case "Recruit Master":
            return gameState.resources.soldiers >= 100;
        case "Wealthy Commander":
            return gameState.resources.gold >= 1000;
        case "Territory Holder":
            return gameState.playerTerritories.length >= 3;
        // Add other cases as needed
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
        playSound(sounds.building, false);
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
        case "Farm":
            gameState.resources.food += 5 * building.level;
            break;
        case "Forge":
            gameState.resources.shield += 2 * building.level;
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
        playSound(sounds.research, false);
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
        case "Advanced Warfare":
            gameState.goldPerSecond = Math.floor(gameState.goldPerSecond * 1.20);
            break;
        case "Resource Management":
            for (const category in gameState.upgrades) {
                gameState.upgrades[category].forEach(upg => {
                    upg.cost = Math.floor(upg.cost * 0.90);
                });
            }
            renderUpgrades('army', armyUpgradesDiv);
            renderUpgrades('economy', economyUpgradesDiv);
            break;
        // Add more cases as needed
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
        playSound(sounds.mission, false);
        showToast(`Mission "${mission.name}" started!`);
        updateDisplay();
        renderMissions();
        saveGame();

        // Simulate mission duration
        setTimeout(() => {
            mission.status = 'completed';
            gameState.resources.gold += mission.reward.gold;
            gameState.resources.prestigePoints += mission.reward.prestige;
            playSound(sounds.mission, false);
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
        playSound(sounds.prestige, false);
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
    gameState.playerTerritories = [];
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
            showToast(`Faction Bonus: Gold per second increased by 10%.`);
            break;
        case "Egyptians":
            setInterval(() => {
                gameState.resources.food += 5;
                updateDisplay();
                saveGame();
            }, 1000);
            showToast(`Faction Bonus: Food increased by 5 per second.`);
            break;
        case "Gauls":
            gameState.goldPerClick = Math.floor(gameState.goldPerClick * 1.20);
            showToast(`Faction Bonus: Gold per click increased by 20%.`);
            break;
        case "Vikings":
            gameState.goldPerClick = Math.floor(gameState.goldPerClick * 1.20);
            showToast(`Faction Bonus: Gold per click increased by 20%.`);
            break;
        case "Spartans":
            setInterval(() => {
                gameState.resources.shield += 1;
                updateDisplay();
                saveGame();
            }, 1000);
            showToast(`Faction Bonus: Shield increased by 1 per second.`);
            break;
        case "Mongols":
            gameState.goldPerSecond = Math.floor(gameState.goldPerSecond * 1.15);
            showToast(`Faction Bonus: Gold per second increased by 15%.`);
            break;
        default:
            break;
    }
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
    const upgradeButton = event.target.closest('.upgrade-button');
    const conquerButton = event.target.closest('.conquer-button');
    const buildButton = event.target.closest('.build-button');
    const researchButton = event.target.closest('.research-button');
    const missionButton = event.target.closest('.mission-button');
    const navItem = event.target.closest('.nav-item');

    if (upgradeButton) {
        const category = upgradeButton.dataset.category;
        const index = upgradeButton.dataset.index;
        buyUpgrade(category, index);
    } else if (conquerButton) {
        const id = parseInt(conquerButton.dataset.id);
        conquerTerritory(id);
    } else if (buildButton) {
        const id = parseInt(buildButton.dataset.id);
        buildBuilding(id);
    } else if (researchButton) {
        const id = parseInt(researchButton.dataset.id);
        unlockResearch(id);
    } else if (missionButton) {
        const id = parseInt(missionButton.dataset.id);
        startMission(id);
    } else if (navItem) {
        const selectedTab = navItem.getAttribute('data-tab');
        switchTab(selectedTab);
    }
});

// Tab Navigation
function switchTab(selectedTab) {
    const tabs = document.querySelectorAll('.tab-pane');
    const navItems = document.querySelectorAll('.nav-item');

    tabs.forEach(tab => {
        if (tab.id === selectedTab) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });

    navItems.forEach(navItem => {
        if (navItem.getAttribute('data-tab') === selectedTab) {
            navItem.classList.add('active');
        } else {
            navItem.classList.remove('active');
        }
    });
}

// Initialize the Game
init();
