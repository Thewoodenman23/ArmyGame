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
        // ... (Other achievements)
    ],
    territories: [
        { id: 1, name: "Territory A", owner: "Neutral", defense: 50, bonus: { goldPerSecond: 5 }, conquerCost: { gold: 100, soldiers: 10 } },
        // ... (Other territories)
    ],
    research: [
        { id: 1, name: "Basic Tactics", description: "Increase soldiers' gold per click by 10%.", cost: { prestige: 2 }, unlocked: false },
        // ... (Other research items)
    ],
    buildings: [
        { id: 1, name: "Barracks", description: "Increase soldier capacity by 10.", cost: { gold: 500 }, level: 0 },
        // ... (Other buildings)
    ],
    missions: [
        { id: 1, name: "Scout the North", description: "Spend 100 Gold and 10 Soldiers to scout.", reward: { gold: 150, prestige: 1 }, status: "available" },
        // ... (Other missions)
    ],
};
