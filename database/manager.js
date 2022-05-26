
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
  static async findServer(id, connection) {
    var sql = "SELECT * FROM Servers WHERE id="+id
    const temp = await connection.query(sql, function (err, result1, fields) {
      if (err) console.log(err);
      return result1;
    });
    console.log(temp)
    return temp;
  }

  static async getPrefix(id, connection) {
    var sql =
      "SELECT prefix FROM Servers WHERE id="+id;
    connection.query(sql, function (err, result, fields) {
      if (err) console.log(err);
      else{
        return result;
      }
    });
  }

  static async updateServerPrefix(id, prefix, connection) {
    var sql = "UPDATE Servers SET prefix ='"+prefix+"' WHERE id="+id
    connection.query(sql, function (err, result, fields) {
      if (err) console.log(err);
      else console.log("Prefix updated successfully!");
    });
  }
};
