# bus++
A simple Express server for getting data about bus departures from Bus Plus i.e. Serbia's public transport system. Data is provided by the [bus-timeline](https://github.com/smiga287/bus-timeline/) package I wrote. 

---

## API
### All APIs respond only to GET requests
- ```/api/bus``` - Gets all bus names that are available for querying
- ```/api/bus/<name>``` - Gets timetables for both directions for a specific bus
- ```/api/bus/<name>?<direction>``` - ```direction``` is an optional query parameter that gets only one of the specified timetables for a given bus. `direction` can be either 0 or 1. 
- ```/api/bus/<name>?<direction><nextArrival>``` - `nextArrival` is an optional query parameter that requires the `direction` query parameter and returns the next arrival in the specified direction for a given bus. `nextArrival` doesn't have a specific value, it's either present or not.

---

## Todo:
- [ ] Replace the SQLite DB for testing with a proper DB
- [ ] Create appropriate documentation
- [ ] Add a live example
