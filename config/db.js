const Sequelize = require("sequelize");
const path = require("path");

const dbPath = path.resolve(__dirname, "busplusplus.db");

const db = new Sequelize({
  dialect: "sqlite",
  storage: dbPath
});

module.exports = db;
