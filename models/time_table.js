const Sequelize = require("sequelize");
const db = require("../config/db");

const TimeTable = db.define(
  "time_table",
  {
    bus_id: { type: Sequelize.STRING },
    json: { type: Sequelize.STRING }
  },
  { freezeTableName: true }
);

module.exports = { TimeTable };
