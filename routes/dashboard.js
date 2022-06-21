const Server = require("../models/Server");
const express = require('express');
const { Permissions } = require('discord.js');
const moment = require('moment');
require('moment-duration-format');

const router = express.Router();

const checkAuth = require('../auth/CheckAuth');


router.get('/server/:guildID/profile', checkAuth, async (req, res) => {
	const userObj = req.client.guilds.cache.get(req.params.guildID).members.cache.get(req.user.id);

	const userSubscription = {
		undefined: 'None',
		0: 'None',
		1: 'Nitro Classic',
		2: 'Nitro Premium',
	};

	const status = {
		'online': '#43b581',
		'idle': '#faa61a',
		'dnd': '#f04747',
		'offline': '#747f8d',
	};

	const statusName = {
		'online': 'Online',
		'idle': 'Idle',
		'dnd': 'Do Not Disturb',
		'offline': 'Offline',
	};

	let statusTypeData;
	let statusGameData;
	let statusColorData;

	if (userObj.presence === null) {
		statusTypeData = 'Offline';
		statusGameData = 'Not Playing/Streaming';
		statusColorData = '#747f8d';
	}
	else {
		statusTypeData = statusName[userObj.presence.status];
		statusGameData = userObj.presence.activities[0] ? userObj.presence.activities[0].name : 'Not Playing/Streaming';
		statusColorData = status[userObj.presence.status];
	}


	try {
		userFlags = userObj.flags.toArray();
	}
	catch (e) {
		userFlags = [];
	}

	res.render('dash/profile', {
		tag: (req.user ? req.user.tag : 'Login'),
		bot: req.client,
		userObj: userObj,
		status: statusTypeData,
		statusColor: statusColorData,
		statusGame: statusGameData,
		moment: moment,
		userSubscription: userSubscription[req.user.premium_type],
		user: req.user || null,
	});
});

router.get('/server/:guildID', checkAuth, async (req, res) => {
	const guildID = req.params.guildID
	const server = req.client.guilds.cache.get(guildID);
	
	
	const serverData = await Server.findByPk(guildID)

	if (!server && req.user.guilds.filter(u => ((u.permissions & 2146958591) === 2146958591)).map(u => u.id).includes(req.params.guildID)) {
		return res.redirect(`https://discord.com/oauth2/authorize?client_id=${req.client.user.id}&scope=bot%20applications.commands&permissions=8&${req.params.guildID}`);
	}
	else if (!server) {
		return res.redirect('/dashboard/servers');
	}

	res.render('dash/manage.ejs', {
		bot: req.client,
		user: req.user || null,
		guild: server,
		serverData: serverData,
	});
});

router.post('/server/:guildID', checkAuth, async (req, res) => {
	const server = req.client.guilds.cache.get(req.params.guildID);
	if (!server) return res.redirect('/dashboard/servers');
	if (!req.client.guilds.cache.get(req.params.guildID).members.cache.get(req.user.id).permissions.has(Permissions.FLAGS.MANAGE_SERVER)) return res.redirect('/dashboard/servers');

	const data = req.body;

	await res.redirect(`/dashboard/server/${req.params.guildID}`);
});

router.get('/server/:guildID/members', checkAuth, async (req, res) => {
	const server = req.client.guilds.cache.get(req.params.guildID);

	if (!server && req.user.guilds.filter(u => ((u.permissions & 2146958591) === 2146958591)).map(u => u.id).includes(req.params.guildID)) {
		return res.redirect(`https://discord.com/oauth2/authorize?client_id=${req.client.user.id}&scope=bot%20applications.commands&permissions=8&guild_id=${req.params.guildID}`);
	}
	else if (!server) {
		return res.redirect('/dashboard/servers');
	}

	const members = server.members.cache.toJSON();

	res.render('dash/members.ejs', {
		bot: req.client,
		user: req.user || null,
		guild: server,
		members: members,
		moment: moment,
	});
});

router.get('/server/:guildID/stats', checkAuth, async (req, res) => {
	const server = req.client.guilds.cache.get(req.params.guildID);

	if (!server && req.user.guilds.filter(u => ((u.permissions & 2146958591) === 2146958591)).map(u => u.id).includes(req.params.guildID)) {
		return res.redirect(`https://discord.com/oauth2/authorize?client_id=${req.client.user.id}&scope=bot%20applications.commands&permissions=8&guild_id=${req.params.guildID}`);
	}
	else if (!server) {
		return res.redirect('/dashboard/servers');
	}

	res.render('dash/stats.ejs', {
		bot: req.client,
		user: req.user || null,
		guild: server,
		moment: moment,
	});
});

router.get('/servers', checkAuth, async (req, res) => {
	res.render('dash/servers', {
		tag: (req.user ? req.user.tag : 'Login'),
		bot: req.client,
		user: req.user || null,
		guilds: req.user.guilds.filter(u => (u.permissions & 2146958591) === 2146958591),
	});
});

module.exports = router;