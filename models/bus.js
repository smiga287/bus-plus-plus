const Sequelize = require("sequelize");
const db = require("../config/db");

const Bus = db.define(
  "time_table",
  {
    name: { type: Sequelize.STRING },
    json: { type: Sequelize.STRING }
  },
  { freezeTableName: true }
);

module.exports = { Bus };
