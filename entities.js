// entities.js
export class Territory {
    constructor(data) {
        Object.assign(this, data);
    }

    canConquer(playerResources) {
        return playerResources.gold >= this.conquerCost.gold && playerResources.soldiers >= this.conquerCost.soldiers;
    }

    attemptConquer(playerResources) {
        if (this.canConquer(playerResources)) {
            playerResources.gold -= this.conquerCost.gold;
            playerResources.soldiers -= this.conquerCost.soldiers;
            // Simplified battle logic
            const successRate = Math.min((playerResources.soldiers / this.defense) * 100, 90);
            const random = Math.random() * 100;
            if (random <= successRate) {
                this.owner = "Player";
                return true;
            }
        }
        return false;
    }
}

export class Building {
    constructor(data) {
        Object.assign(this, data);
    }

    canBuild(playerResources) {
        return playerResources.gold >= this.cost.gold;
    }

    build(playerResources) {
        if (this.canBuild(playerResources)) {
            playerResources.gold -= this.cost.gold;
            this.level += 1;
            return true;
        }
        return false;
    }
}

// Define other entities like Mission, ResearchItem if needed
