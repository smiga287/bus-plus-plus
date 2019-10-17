const express = require("express");
const { query, validationResult } = require("express-validator/check");
const { Bus } = require("../models/bus");
const router = express.Router();

// * Gets all bus names
router.get("/bus", async (req, res) => {
  try {
    const buses = await Bus.findAll();
    const names = buses.map(b => b.name);
    res.send(names);
  } catch (error) {
    console.error(error);
    res.status(500).send("There are no buses in DB");
  }
});

function getCurrentDayIdx(date) {
  const WORK_DAYS = 0;
  const SATURDAY = 1;
  const SUNDAY = 2;
  const day = date.getDay();
  if (day >= 1 && day <= 5) {
    return WORK_DAYS;
  } else if (day === 6) {
    return SATURDAY;
  } else {
    return SUNDAY;
  }
}

function getNextArrival(timeTable) {
  const date = new Date();
  const curDayIdx = getCurrentDayIdx(date);
  const curHour = date.getHours();
  const curMinute = date.getMinutes();

  const getFirstArrival = () => {
    const firstHour = parseInt(Object.keys(timeTable)[0]);
    const firstMinute = parseInt(timeTable[firstHour][curDayIdx][0]);
    return { hour: firstHour, minute: firstMinute };
  };

  // if there is no bus in the current hour take first arrival
  // if timeTable.hasHour(k) == False --> timeTable.hasHour(k + 1) == False
  if (!(curHour in timeTable)) {
    return getFirstArrival();
  }

  const nextMinutes = timeTable[curHour][curDayIdx].map(m => parseInt(m));
  const nextMinute = nextMinutes.find(m => m > curMinute);

  // if there is a bus in the current hour
  if (nextMinute) {
    return { hour: curHour, minute: nextMinute };
  }

  const nextHour = curHour === 23 ? 0 : curHour + 1;
  // if there is no bus in the next hour
  if (!(nextHour in timeTable)) {
    return getFirstArrival();
  }

  // if there is a bus in next hour take first
  const firstMinute = timeTable[nextHour][curDayIdx][0];
  return { hour: nextHour, minute: firstMinute };
}

const DIRECTIONS = [0, 1];
router.get(
  "/bus/:name",
  [
    query("direction")
      .toInt()
      .isIn(DIRECTIONS)
      .optional(),
    query("nextArrival")
      .toBoolean()
      .optional()
  ],
  async (req, res) => {
    // Finds the validation errors in req.query
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    try {
      const { name } = req.params;
      const { json } = await Bus.findOne({ where: { name } });
      const bothDirections = JSON.parse(json); // get timetable for both directions

      const { direction, nextArrival } = req.query;
      // if got only direction --> return all departures in given direction
      // if both direction and nextArrival are given --> return nextArrival
      if (DIRECTIONS.includes(direction)) {
        const oneDirection = bothDirections[direction]; // ? direction can be 0 or 1
        return res.send(
          nextArrival ? getNextArrival(oneDirection) : oneDirection
        );
      }

      // if no params given --> return both time tables
      res.send(bothDirections);
    } catch (error) {
      console.error(error);
      res.status(404).send("The specified bus doesn't exist in the DB");
    }
  }
);

module.exports = router;
