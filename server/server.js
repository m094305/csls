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
    const hours = req.body.hours !== undefined ? req.body.hours : req.query.hours;
    const faceitElo = req.body.faceitElo !== undefined ? req.body.faceitElo : req.query.faceitElo;
    const premierElo = req.body.premierElo !== undefined ? req.body.premierElo : req.query.premierElo;

    if (!nameTyped) {
        return res.status(400).json({ error: 'Name is required.' });
    }
    if (hours === undefined || faceitElo === undefined || premierElo === undefined) {
        return res.status(400).json({ error: 'In-game hours, Faceit Elo, and Premier Elo are required.' });
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
        name: nameTyped,
        hours: parseInt(hours, 10),
        faceitElo: parseInt(faceitElo, 10),
        premierElo: parseInt(premierElo, 10)
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
    const creatorName = req.body.creatorName || req.query.creatorName || 'Anonymous';
    const creatorHours = req.body.creatorHours || req.query.creatorHours || '0';
    const creatorFaceit = req.body.creatorFaceit || req.query.creatorFaceit || '0';
    const creatorPremier = req.body.creatorPremier || req.query.creatorPremier || '0';

    if (!name || !type || !position || !description) {
        return res.status(400).json({ error: 'All fields (name, type, position, description) are required.' });
    }

    if (!customLineups[mapId]) {
        customLineups[mapId] = [];
    }

    const newLineup = { 
        name, 
        type, 
        position, 
        description,
        creatorName,
        creatorHours: parseInt(creatorHours, 10),
        creatorFaceit: parseInt(creatorFaceit, 10),
        creatorPremier: parseInt(creatorPremier, 10)
    };
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

// Comments Storage & Handlers
const comments = [];

function getComments(req, res) {
    return res.json(comments);
}

function addComment(req, res) {
    const text = req.body.text || req.query.text;
    const creatorName = req.body.creatorName || req.query.creatorName || 'Anonymous';
    const creatorHours = req.body.creatorHours || req.query.creatorHours || '0';
    const creatorFaceit = req.body.creatorFaceit || req.query.creatorFaceit || '0';
    const creatorPremier = req.body.creatorPremier || req.query.creatorPremier || '0';

    if (!text) {
        return res.status(400).json({ error: 'Comment text is required.' });
    }

    const newComment = {
        id: comments.length + 1,
        text,
        timestamp: new Date().toISOString(),
        creatorName,
        creatorHours: parseInt(creatorHours, 10),
        creatorFaceit: parseInt(creatorFaceit, 10),
        creatorPremier: parseInt(creatorPremier, 10)
    };
    comments.push(newComment);
    return res.json({ success: true, comments });
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

// Comments routes
server.get('/api/comments', getComments);
server.post('/api/comments', addComment);
server.get('/api/comments/add', addComment);

server.listen(PORT, function () {
    console.log("Server is running on port 3000!");
});