require("dotenv").config();
const config = require("./config.json");
const path = require("node:path");
const Server = require("./models/Server");

const {
  Client,
  MessageEmbed,
  Formatters,
  Intents,
  Constants,
  Permissions,
  Collection,
} = require("discord.js");

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

const fs = require("fs");
const util = require("util");

const cmdload = async () => {
  client.commands = new Collection();
  const commandsPath = path.join(__dirname, "commands");
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    // Set a new item in the Collection
    // With the key as the command name and the value as the exported module
    client.commands.set(command.data.name, command);
  }
};

cmdload();
client.on("error", console.error);

client.on("ready", async () => {
  console.log("Ziv sam!");
  const webPortal = require('./server');
	webPortal.load(client);
});

client.on('guildCreate', async guild => {
	if (!guild.available) return;
  const serverId = guild.id
  const serverName = guild.name

	const newServer = await Server.create({
    serverId,
    serverName
  });
  
  await newServer.save();

	console.log(`Joined server: ${guild.name}`);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;
  try {
    await command.execute(client, interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "There was an error while executing this command!",
      ephemeral: true,
    });
  }
});

module.exports = { client };
client.login(config.token);
