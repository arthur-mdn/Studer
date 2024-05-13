const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();
const config = require('../others/config');

router.post('/auth/register', async (req, res) => {
    try {

    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur: ' + error });
    }
});


router.get('/auth/validate-session', (req, res) => {
    const token = req.cookies['session_token'];
    if (!token) {
        return res.json({ isAuthenticated: false });
    }
    try {
        jwt.verify(token, config.secretKey);
        res.json({ isAuthenticated: true });
    } catch (err) {
        res.json({ isAuthenticated: false });
    }
});

router.post('/auth/logout', (req, res) => {
    res.clearCookie('session_token');
    res.json({ message: 'Déconnexion réussie' });
});

module.exports = router;