const {
	Client,
	MessageEmbed,
	Formatters,
	Intents,
	Constants,
  } = require("discord.js");
  const { stripIndents } = require("common-tags");
  const mysql = require("mysql");
  const db = require('./database/manager');
  
  const { token } = require("./config.json");
  
  var connection = mysql.createConnection({
	  host: "sql11.freesqldatabase.com",
	  user: "sql11494824",
	  password: "tjs2CYq54C",
	  database: "sql11494824"
	});
  
  const client = new Client({
	allowedMentions: {
	  parse: ["users", "roles"],
	  repliedUser: true,
	},
	restSweepInterval: 30,
	restTimeOffset: 250,
	partials: [
	  Constants.PartialTypes.GUILD_MEMBER,
	  Constants.PartialTypes.MESSAGE,
	  Constants.PartialTypes.CHANNEL,
	  Constants.PartialTypes.USER,
	  Constants.PartialTypes.REACTION,
	],
	intents: [
	  Intents.FLAGS.GUILDS,
	  Intents.FLAGS.GUILD_MEMBERS,
	  Intents.FLAGS.GUILD_PRESENCES,
	  Intents.FLAGS.GUILD_MESSAGES,
	],
  });
  
  client.on("ready", async () => {
	console.log("Ziv sam!");
  
  
	connection.connect((error) => {
	  if (error) {
		console.log("Error connecting to the MySQL Database");
		return;
	  }
	  var sql =
		"CREATE TABLE Servers (id VARCHAR(255), prefix CHAR)";
	  connection.query(sql, function (err, result) {
		if (err) console.log("Table already exists!");
		else console.log("Table created");
		
	  });
	  console.log("Connection established sucessfully");
	});
  });
  
  
  client.on("guildCreate", async (guild) => {
	if (!guild.available) return;
  
	await db.createServer(guild.id, connection);
  
	console.log(`Joined server: ${guild.name}`);
  });
  
  client.on("interactionCreate", async (interaction) => {
	if (interaction.user.bot) return;
	if (!interaction.inGuild() && interaction.isCommand())
	  return interaction.reply({
		content: "You must be in a server to use commands.",
	  });
  
	if (interaction.isCommand()) {
	  if (interaction.commandName === "ping") {
		const now = Date.now();
		await interaction.deferReply();
  
		await interaction.followUp({
		  content: `🏓 Pong!\n\nRoundtrip: **${Math.round(
			Date.now() - now
		  )}ms**\nAPI Latency: **${Math.round(client.ws.ping)}ms**`,
		});
	  } else if (interaction.commandName === "prefix") {
		await interaction.deferReply();
  
		const subCommand = interaction.options.getSubcommand();
  
		if (subCommand === "view") {
		  const server = await db.findServer(interaction.guild.id);
  
		  await interaction.followUp({
			content: `The prefix for this server ${
			  server.prefix ? `is **\`${server.prefix}\`**` : "has not been set."
			}`,
		  });
		} else if (subCommand === "set") {
		  const prefix = interaction.options.getString("value");
		  if (prefix.length > 3)
			return interaction.followUp({
			  content: "The prefix cannot be more than **3** characters long!",
			});
  
		  await db.updateServerPrefix(interaction.guild.id, prefix);
  
		  return await interaction.followUp({
			content: `Successfully set **${interaction.guild.name}**'s prefix to **\`${prefix}\`**`,
		  });
		}
	  }
	}
  
	if (interaction.isContextMenu()) {
	  if (interaction.commandName === "User Info") {
		const member = interaction.guild.members.cache.get(interaction.targetId);
  
		const embed = new MessageEmbed()
		  .setAuthor({
			name: member.user.tag,
			iconURL: member.user.displayAvatarURL({ dynamic: true, size: 2048 }),
		  })
		  .setColor("#5865F2").setDescription(stripIndents`
				  **ID:** ${member.id}
				  **Bot:** ${member.bot ? "Yes" : "No"}
				  **Created:** ${Formatters.time(
					Math.trunc(member.user.createdTimestamp / 1000),
					"d"
				  )}
				  **Joined:** ${Formatters.time(
					Math.trunc(member.joinedAt / 1000),
					"d"
				  )}
				  **Nickname:** ${member.nickname || "None"}
				  **Hoist Role:** ${
					member.roles.hoist ? member.roles.hoist.name : "None"
				  }
				  `);
  
		await interaction.reply({ embeds: [embed] });
	  }
	}
  });
  
  client.login(token);