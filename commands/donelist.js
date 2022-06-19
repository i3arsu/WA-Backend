const Task = require("../models/Task");
const Discord = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
		.setName('donelist')
		.setDescription('Lists done tasks'),
  async execute(client, interaction) {
    try {
        const channelId = interaction.channel.id;
        const tasks = await Task.findAll({
            where: {
              archive: false,
              isDone: true,
              serverId: interaction.guild.id,
            },
            attributes: ["id", "text", "assignTo"],
          });

          let messageContent = tasks
            .map((task, idx) => {
              if (task.assignTo) {
                return `${idx + 1}. ${task.text} - <@${task.assignTo}> - ${
                  task.id
                }\n`;
              } else {
                return `${idx + 1}. ${task.text} - ${task.id}\n`;
              }
            })
            .join("");
      
          const embed = new Discord.MessageEmbed()
            .setColor("#0099ff")
            .setTitle("Task List (Done)")
            .setDescription(
              messageContent +
                "\n To Add a task back, send `t!undo 1`. Replace 1 with the ID(last digit)"
            );
      
            interaction.reply("Listed done tasks successfully!")
            return client.channels.cache.get(channelId).send({embeds: [embed]});
    }catch (error) {
        console.error(error.toString());
        return interaction.reply("Couldn't list tasks");
      }
  },
};