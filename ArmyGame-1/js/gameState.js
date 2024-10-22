// gameState.js

export const gameState = {
    resources: {
        gold: 0,
        food: 0,
        soldiers: 0,
        shield: 0,
        prestigePoints: 0,
    },
    faction: null,
    goldPerClick: 1,
    goldPerSecond: 0,
    bonuses: {
        goldPerSecond: 0,
        foodPerSecond: 0,
        shieldPerSecond: 0,
    },
    playerTerritories: [], // List of territory IDs owned by the player
    upgrades: {
        army: [
            { name: "Advanced Training", cost: 50, goldPerSecond: 5, owned: 0, originalCost: 50 },
            { name: "Elite Units", cost: 150, goldPerSecond: 15, owned: 0, originalCost: 150 },
            // Add more army upgrades
        ],
        economy: [
            { name: "Market Expansion", cost: 100, goldPerSecond: 10, owned: 0, originalCost: 100 },
            { name: "Trade Agreements", cost: 300, goldPerSecond: 30, owned: 0, originalCost: 300 },
            // Add more economy upgrades
        ],
    },
    achievements: [
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
    ],
    territories: [
        // Territories with adjacency and grid positions
        {
            id: 1,
            name: "Territory A",
            adjacent: [2, 4],
            owner: "Neutral",
            defense: 50,
            bonus: { goldPerSecond: 5 },
            conquerCost: { gold: 100, soldiers: 10 },
            gridPosition: { row: 1, col: 1 },
        },
        {
            id: 2,
            name: "Territory B",
            adjacent: [1, 3, 5],
            owner: "Neutral",
            defense: 60,
            bonus: { foodPerSecond: 3 },
            conquerCost: { gold: 150, soldiers: 15 },
            gridPosition: { row: 1, col: 2 },
        },
        {
            id: 3,
            name: "Territory C",
            adjacent: [2, 6],
            owner: "Neutral",
            defense: 70,
            bonus: { shieldPerSecond: 2 },
            conquerCost: { gold: 200, soldiers: 20 },
            gridPosition: { row: 1, col: 3 },
        },
        {
            id: 4,
            name: "Territory D",
            adjacent: [1, 5, 7],
            owner: "Neutral",
            defense: 55,
            bonus: { goldPerSecond: 4 },
            conquerCost: { gold: 120, soldiers: 12 },
            gridPosition: { row: 2, col: 1 },
        },
        {
            id: 5,
            name: "Territory E",
            adjacent: [2, 4, 6, 8],
            owner: "Neutral",
            defense: 65,
            bonus: { foodPerSecond: 4 },
            conquerCost: { gold: 180, soldiers: 18 },
            gridPosition: { row: 2, col: 2 },
        },
        {
            id: 6,
            name: "Territory F",
            adjacent: [3, 5, 9],
            owner: "Neutral",
            defense: 75,
            bonus: { shieldPerSecond: 3 },
            conquerCost: { gold: 220, soldiers: 22 },
            gridPosition: { row: 2, col: 3 },
        },
        {
            id: 7,
            name: "Territory G",
            adjacent: [4, 8],
            owner: "Neutral",
            defense: 60,
            bonus: { goldPerSecond: 6 },
            conquerCost: { gold: 140, soldiers: 14 },
            gridPosition: { row: 3, col: 1 },
        },
        {
            id: 8,
            name: "Territory H",
            adjacent: [5, 7, 9],
            owner: "Neutral",
            defense: 70,
            bonus: { foodPerSecond: 5 },
            conquerCost: { gold: 200, soldiers: 20 },
            gridPosition: { row: 3, col: 2 },
        },
        {
            id: 9,
            name: "Territory I",
            adjacent: [6, 8],
            owner: "Neutral",
            defense: 80,
            bonus: { shieldPerSecond: 4 },
            conquerCost: { gold: 250, soldiers: 25 },
            gridPosition: { row: 3, col: 3 },
        },
    ],
    research: [
        { id: 1, name: "Basic Tactics", description: "Increase soldiers' gold per click by 10%.", cost: { prestige: 2 }, unlocked: false },
        { id: 2, name: "Advanced Warfare", description: "Increase gold per second by 20%.", cost: { prestige: 5 }, unlocked: false },
        { id: 3, name: "Resource Management", description: "Reduce upgrade costs by 10%.", cost: { prestige: 8 }, unlocked: false },
        // Add more research items
    ],
    buildings: [
        { id: 1, name: "Barracks", description: "Increase soldier capacity by 10.", cost: { gold: 500 }, level: 0 },
        { id: 2, name: "Farm", description: "Increase food production.", cost: { gold: 700 }, level: 0 },
        { id: 3, name: "Forge", description: "Increase shield production.", cost: { gold: 1000 }, level: 0 },
        // Add more buildings
    ],
    missions: [
        { id: 1, name: "Scout the North", description: "Spend 100 Gold and 10 Soldiers to scout.", reward: { gold: 150, prestige: 1 }, status: "available" },
        { id: 2, name: "Defend the Borders", description: "Spend 200 Gold and 20 Soldiers to defend.", reward: { gold: 250, prestige: 2 }, status: "available" },
        { id: 3, name: "Conquer Enemy Base", description: "Spend 300 Gold and 30 Soldiers to conquer.", reward: { gold: 400, prestige: 3 }, status: "available" },
        // Add more missions
    ],
};
