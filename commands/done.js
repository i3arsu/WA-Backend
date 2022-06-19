const Task = require("../models/Task");
const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("done")
    .setDescription("Completes the task")
    .addStringOption(option => option.setName('taskid').setDescription('Enter the task id:')),
  async execute(client, interaction) {
    try {
      const id = interaction.options.getString("taskid");
      const channelId = interaction.channel.id;

      if (!id) {
        const errorEmbed = new Discord.MessageEmbed()
          .setColor("#0099ff")
          .setTitle("Error")
          .setDescription(
            "You need to enter the id of the task to tick it off\n" +
              "Enter `t!help` for help"
          );
          interaction.deferReply();
          return client.channels.cache.get(channelId).send({embeds: [errorEmbed]});
      }

      const task = await Task.findByPk(id);

      if (!task) {
        const errorEmbed = new Discord.MessageEmbed()
          .setColor("#0099ff")
          .setTitle("Error")
          .setDescription("Task does not exist");
          interaction.deferReply();
          return client.channels.cache.get(channelId).send({embeds: [errorEmbed]});
      }

      if (task.serverId === interaction.guild.id) {
        await Task.update(
          { isDone: true },
          {
            where: {
              id,
            },
          }
        );
      } else {
        const errorEmbed = new Discord.MessageEmbed()
          .setColor("#0099ff")
          .setTitle("Error")
          .setDescription(
            "You can only tick off a task from the current server"
          );
          interaction.deferReply();
          return client.channels.cache.get(channelId).send({embeds: [errorEmbed]});
      }

      const embed = new Discord.MessageEmbed()
        .setColor("#0099ff")
        .setTitle("Done ✅")
        .setDescription(
          `Task with id: ${id} has been ticked off your todo list`
        );
        interaction.reply("Task completed successfully!");
        return client.channels.cache.get(channelId).send({embeds: [embed]});
    } catch (error) {
      console.error(error.toString());
      return interaction.reply("Couldn't complete the task!");
    }
  },
};
