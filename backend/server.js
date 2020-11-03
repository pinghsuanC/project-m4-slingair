"use strict";

// import the needed node_modules.
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const {
  getFlights,
  getFlight,
  getReservations,
  addReservations,
  getSingleReservationByFS,
  getSingleReservationById,
  deleteReservation,
  updateReservation,
} = require("./handlers");

express()
  // Below are methods that are included in express(). We chain them for convenience.
  // --------------------------------------------------------------------------------

  // This will give us will log more info to the console. see https://www.npmjs.com/package/morgan
  .use(morgan("tiny"))
  .use(bodyParser.json())

  // Any requests for static files will go into the public folder
  .use(express.static("public"))

  // Nothing to modify above this line
  // ---------------------------------
  // add new endpoints here 👇
  // return structure: res.status(200).json({ status: 200, data: {}, message: {} });
  //  always return data related whether fail or not
  //  if no data need to be returned, provide message

  // get flights
  .get("/flights", getFlights)
  // get single flight
  .get("/flights/:flight_num", getFlight)
  // get reservation
  .get("/reservations", getReservations)
  // get single reservation
  .get("/reservations/:id", getSingleReservationById)
  // get single reservation
  .get("/reservations/:flight/:seat", getSingleReservationByFS)
  // post a reservation
  .post("/reservations", addReservations)
  // delete a reservation
  .delete("/reservations", deleteReservation)
  // update a reservation (chose to use patch)
  .patch("/reservations", updateReservation)

  // add new endpoints here ☝️
  // ---------------------------------
  // Nothing to modify below this line

  // this is our catch all endpoint.
  .get("*", (req, res) => {
    res.status(404).json({
      status: 404,
      message: "This is obviously not what you are looking for.",
    });
  })

  // Node spins up our server and sets it to listen on port 8000.
  .listen(8000, () => console.log(`Listening on port 8000`));
