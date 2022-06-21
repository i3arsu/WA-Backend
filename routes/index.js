const express = require('express');
const { version } = require('discord.js');
const moment = require('moment');
require('moment-duration-format');
const passport = require('passport');


const router = express.Router();

router.get('/', async (req, res) => {
	res.render('index', {
		tag: (req.user ? req.user.tag : 'Login'),
		bot: req.client,
		user: req.user || null,
	});
});

router.get('/stats', async (req, res) => {
	res.render('stats', {
		tag: (req.user ? req.user.tag : 'Login'),
		bot: req.client,
		user: req.user || null,
		uptime: moment.duration(req.client.uptime).format(' D [days], H [hours], m [minutes], s [seconds]'),
		djsVersion: version,
	});
});

router.get('/invite', async function(req, res) {
	res.redirect(`https://discord.com/api/oauth2/authorize?client_id=${req.client.user.id}&permissions=8&scope=bot%20applications.commands`);
});

router.get('/login', passport.authenticate('discord', { failureRedirect: '/' }), async function(req, res) {
	if (!req.user.id || !req.user.guilds) {
		res.redirect('/');
	}
	else {res.redirect('/');}
});

router.get('/logout', async function(req, res) {
	req.session.destroy(() => {
		req.logout();
		res.redirect('/');
	});
});

module.exports = router;