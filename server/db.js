const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'db.json');

let dbData = {
    accounts: [],
    customLineups: {},
    comments: []
};

function loadDB() {
    try {
        if (!fs.existsSync(DB_FILE)) {
            saveDB();
        } else {
            const content = fs.readFileSync(DB_FILE, 'utf8');
            dbData = JSON.parse(content);
        }
    } catch (err) {
        console.error("Error reading database file, using fallback in-memory:", err);
    }
}

function saveDB() {
    try {
        fs.writeFileSync(DB_FILE, JSON.stringify(dbData, null, 4), 'utf8');
    } catch (err) {
        console.error("Error writing database file:", err);
    }
}

loadDB();

module.exports = {
    getAccounts() {
        return dbData.accounts;
    },
    addAccount(user) {
        dbData.accounts.push(user);
        saveDB();
        return user;
    },

    getLineups(mapId) {
        return dbData.customLineups[mapId] || [];
    },
    addLineup(mapId, lineup) {
        if (!dbData.customLineups[mapId]) {
            dbData.customLineups[mapId] = [];
        }
        dbData.customLineups[mapId].push(lineup);
        saveDB();
        return dbData.customLineups[mapId];
    },
    deleteLineup(mapId, index) {
        const list = dbData.customLineups[mapId] || [];
        if (index >= 0 && index < list.length) {
            list.splice(index, 1);
            saveDB();
        }
        return list;
    },

    getComments() {
        return dbData.comments;
    },
    addComment(comment) {
        dbData.comments.push(comment);
        saveDB();
        return dbData.comments;
    },
    deleteComment(id) {
        const index = dbData.comments.findIndex(c => c.id === id);
        if (index !== -1) {
            dbData.comments.splice(index, 1);
            saveDB();
        }
        return dbData.comments;
    }
};
