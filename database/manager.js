const Server = null

module.exports = class Manager {
  static async createServer(id, connection) {
    var sql =
      "INSERT INTO Servers (id, prefix) VALUES ("+"'"+id+"'"+", NULL)";
    connection.query(sql, function (err, result) {
      if (err) console.log(err);
      else console.log("1 record inserted");
    });
    // const result = new Server({
    //   serverId: id,
    //   prefix: null,
    // });

    // await result.save();

    // return result;
  }
  static async findServer(id) {

    var sql =
      "SELECT id FROM Servers (id, prefix) VALUES ("+"'"+id+"'"+", NULL)";
    connection.query(sql, function (err, result, fields) {
      if (err) console.log(err);
      else{
        console.log("1 record inserted");
        return result;
      }
    });
    const result = await Server.findOne({ serverId: id });

    return result;
  }

  static async getPrefix(id) {
    const result = await Server.findOne({ serverId: id });

    return result.prefix;
  }

  static async updateServerPrefix(id, prefix) {
    const result = await Server.findOne({ serverId: id });

    if (result) {
      return await result.updateOne({ prefix });
    } else {
      return;
    }
  }
};
