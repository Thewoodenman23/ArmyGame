// entities.js

export class Territory {
    constructor(data) {
        Object.assign(this, data);
        this.adjacent = data.adjacent || [];
        this.gridPosition = data.gridPosition || { row: 1, col: 1 };
    }

    canConquer(playerResources, playerTerritories) {
        // Check if the territory is adjacent to a territory the player owns
        const isAdjacentToPlayer = this.adjacent.some(adjacentId =>
            playerTerritories.includes(adjacentId)
        );

        // If the player doesn't own any territories yet, they can conquer any territory
        const canConquer =
            (playerTerritories.length === 0 || isAdjacentToPlayer) &&
            playerResources.gold >= this.conquerCost.gold &&
            playerResources.soldiers >= this.conquerCost.soldiers;

        return canConquer;
    }

    attemptConquer(playerResources, playerTerritories) {
        if (this.canConquer(playerResources, playerTerritories)) {
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
