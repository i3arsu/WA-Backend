const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const Servers = sequelize.define("Servers", {
  serverId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  serverName: {
    type: DataTypes.STRING,
    defaultValue: false,
  },
  dateJoined: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

Servers.sync({force: true});

module.exports = Servers;