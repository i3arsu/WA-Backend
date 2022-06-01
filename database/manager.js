module.exports = class Manager {
  static async createServer(id, connection) {
    var sql =
      "INSERT INTO Servers (id, prefix) VALUES (" + "'" + id + "'" + ", NULL)";
    connection.query(sql, function (err, result) {
      if (err) console.log(err);
      else console.log("1 record inserted");
    });
  }
  static findServer(id, connection) {
    return new Promise((resolve, reject) => {
      var sql = "SELECT * FROM Servers WHERE id=" + id;
      connection.query(sql, function (err, result, fields) {
        return err ? reject(err) : resolve(result[0]);
      });
    });
  }

  static async getPrefix(id, connection) {
    var sql = "SELECT prefix FROM Servers WHERE id=" + id;
    connection.query(sql, function (err, result, fields) {
      if (err) console.log(err);
      else {
        return result;
      }
    });
  }

  static async updateServerPrefix(id, prefix, connection) {
    var sql = "UPDATE Servers SET prefix ='" + prefix + "' WHERE id=" + id;
    connection.query(sql, function (err, result, fields) {
      if (err) console.log(err);
      else console.log("Prefix updated successfully!");
    });
  }
};
