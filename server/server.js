const express = require('express');
const cors = require('cors');
const server = express();
const PORT = 3000;

server.use(cors({ origin: 'http://localhost:8000' }));
server.use(express.json());

const accounts = [];

function handleLogin(req, res) {
    const nameTyped = req.body.name || req.query.name;

    if (!nameTyped) {
        return res.status(400).json({ error: 'Name is required.' });
    }

    let foundUser = null;
    for (let i = 0; i < accounts.length; i++) {
        if (accounts[i].name === nameTyped) {
            foundUser = accounts[i];
        }
    }

    if (foundUser === null) {
        return res.status(404).json({ error: 'Account does not exist.' });
    }

    return res.json({ success: true, user: foundUser });
}

function handleSignup(req, res) {
    const nameTyped = req.body.name || req.query.name;

    if (!nameTyped) {
        return res.status(400).json({ error: 'Name is required.' });
    }

    let nameExists = false;
    for (let i = 0; i < accounts.length; i++) {
        if (accounts[i].name === nameTyped) {
            nameExists = true;
        }
    }

    if (nameExists === true) {
        return res.status(409).json({ error: 'This name is already taken.' });
    }

    const newUser = {
        id: accounts.length + 1,
        name: nameTyped
    };

    accounts.push(newUser);
    return res.json({ success: true, user: newUser });
}

// In-memory custom lineups dictionary (mapId -> array of lineups)
const customLineups = {};

function getLineups(req, res) {
    const { mapId } = req.params;
    const list = customLineups[mapId] || [];
    return res.json(list);
}

function addLineup(req, res) {
    const { mapId } = req.params;
    const name = req.body.name || req.query.name;
    const type = req.body.type || req.query.type;
    const position = req.body.position || req.query.position;
    const description = req.body.description || req.query.description;

    if (!name || !type || !position || !description) {
        return res.status(400).json({ error: 'All fields (name, type, position, description) are required.' });
    }

    if (!customLineups[mapId]) {
        customLineups[mapId] = [];
    }

    const newLineup = { name, type, position, description };
    customLineups[mapId].push(newLineup);
    return res.json({ success: true, lineups: customLineups[mapId] });
}

function deleteLineup(req, res) {
    const { mapId, index } = req.params;
    const list = customLineups[mapId] || [];
    const idx = parseInt(index, 10);

    if (idx >= 0 && idx < list.length) {
        list.splice(idx, 1);
    }
    return res.json({ success: true, lineups: list });
}

server.post('/api/login', handleLogin);
server.get('/api/login', handleLogin);
server.post('/api/signup', handleSignup);
server.get('/api/signup', handleSignup);

// Lineup routes
server.get('/api/lineups/:mapId', getLineups);
server.post('/api/lineups/:mapId', addLineup);
server.get('/api/lineups/:mapId/add', addLineup);
server.post('/api/lineups/:mapId/delete/:index', deleteLineup);
server.get('/api/lineups/:mapId/delete/:index', deleteLineup);

server.listen(PORT, function () {
    console.log("Server is running on port 3000!");
});