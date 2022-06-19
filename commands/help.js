const Discord = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Shows all commands'),
  async execute(client, interaction) {
    const channelId = interaction.channel.id;
    const embed = new Discord.MessageEmbed()
      .setColor("#0099ff")
      .setTitle("Help")
      .setDescription(
        `
		    Zamisli traziti pomoc
		  `
      );

    interaction.reply("Listed all commands!")
    return client.channels.cache.get(channelId).send({embeds: [embed]});
  },
};