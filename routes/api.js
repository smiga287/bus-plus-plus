const express = require("express");
const { TimeTable } = require("../models/time_table");
const router = express.Router();

router.get("/bus", async (req, res) => {
  try {
    const tables = await TimeTable.findAll();
    const names = tables.map(t => t.bus_id);
    res.send(names);
  } catch (error) {
    console.error(error);
    res.status(500).send("There are no busses in DB");
  }
});

function getCurrentDayIdx(date) {
  const day = date.getDay();
  if (day >= 1 && day <= 5) return 0;
  else if (day === 6) return 1;
  else return 2;
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

router.get("/bus/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { json } = await TimeTable.findOne({ where: { bus_id: id } });
    const bothDirections = JSON.parse(json); // get timetable for both directions

    // TODO: add middleware to validate input
    const { direction, nextArrival } = req.query;
    // if got only direction --> return all departures in given direction
    // if both direction and nextArrival are given --> return nextArrival
    if (direction) {
      const oneDirection = bothDirections[parseInt(direction)]; // ? direction can be 0 or 1
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
});

module.exports = router;
