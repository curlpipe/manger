class Storage {
    constructor(storageType = 'localStorage') {
        if (storageType !== 'localStorage' && storageType !== 'sessionStorage') {
            throw new Error("Invalid storage type. Use 'localStorage' or 'sessionStorage'.");
        }
        this.storage = window[storageType];
    }

    // Store a value
    setItem(key, value) {
        if (typeof value === 'object') {
            this.storage.setItem(key, JSON.stringify(value));
        } else {
            this.storage.setItem(key, value);
        }
    }

    // Retrieve a value
    getItem(key) {
        const value = this.storage.getItem(key);
        try {
            return JSON.parse(value); // Attempt to parse JSON
        } catch {
            return value; // Return the value as is if not JSON
        }
    }

    // Remove a value
    removeItem(key) {
        this.storage.removeItem(key);
    }

    // Clear all storage
    clear() {
        this.storage.clear();
    }

    // Check if an item exists
    hasItem(key) {
        return this.storage.getItem(key) !== null;
    }

    // Get all keys
    getAllKeys() {
        return Object.keys(this.storage);
    }
}

export default Storage;
