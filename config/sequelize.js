const Sequelize = require("sequelize");
const config = require("../config.json")

const sequelize = new Sequelize(
  "discordBot",
  config.user,
  config.password,
  {
    host: config.host,
    port: config.port,
    dialect: "mysql",
  }
);

module.exports = sequelize;