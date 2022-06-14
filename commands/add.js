const Task = require("../models/Task");
const { MessageEmbed, Channel } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
		.setName('add')
		.setDescription('Adds task')
    .addStringOption(option => option.setName('task').setDescription('Enter a task'))
    .addUserOption(option => option.setName('target').setDescription('User who needs to do the task')),
  async execute(client, interaction) {
    try {
      const text = interaction.options.getString("task");

      // Get Tagged User (first) to assign
      const taggedUser = interaction.options.getUser("target")
      let taggedUserId = "";
      if (taggedUser) {
        taggedUserId = taggedUser.id;
      }

      const serverId = interaction.guild.id;

      const newTask = await Task.create({
        text,
        serverId,
        assignTo: taggedUserId,
      });

      await newTask.save();
      const channel = channels.cache.get(interaction.channel)

      const embed = new MessageEmbed()
        .setColor("#0099ff")
        .setTitle("Added")
        .setDescription(`Task ${newTask.text} was added`);
      return client.Channel.send({embeds: [embed]});
    } catch (error) {
      console.error(error.toString());
      return interaction.reply("Couldn't create task");
    }
  },
};