"use strict";

// use this package to generate unique ids: https://www.npmjs.com/package/uuid
const { v4: uuidv4 } = require("uuid");

//  Use this data. Changes will persist until the server (backend) restarts.
const { flights, reservations, reservations_id } = require("./data");

const getFlights = (req, res) => {
  // return all flight numbers
  // data is a list of flight numbers
  res.status(200).json({
    status: 200,
    data: Object.keys(flights),
    message: "successfull retrieved flight numbers.",
  });
  return;
};

const getFlight = (req, res) => {
  // return a flight info (seat info), if not return empty [] and a not-found message
  let flight_num = req.params["flight_num"];
  let flight_data = flights[flight_num];

  if (flight_data) {
    res.status(200).json({
      status: 200,
      data: flight_data,
      message: `Successful retrieved flight ${flight_num} data`,
    });
    return;
  } else {
    res.status(404).json({
      status: 404,
      data: [],
      message: `Flight ${flight_num} was not found`,
    });
    return;
  }
};

const getReservations = (req, res) => {
  // return all reservations
  res.status(200).json({
    status: 200,
    data: reservations,
    message: `Successful retrieved all reservations.`,
  });
  return;
};

const getSingleReservationByFS = (req, res) => {
  // it wasn't specified therefore get by flight and seat (nobody would be able to type the id lol)
  // will add another option for getting by id if frontend needs

  const { flight, seat } = req.params;
  // loop through reservation
  let r;
  for (r of reservations) {
    if (
      r["flight"].toLowerCase() === flight.toLowerCase() &&
      r["seat"].toLowerCase() === seat.toLowerCase()
    ) {
      res.status(200).json({
        status: 200,
        data: r,
        message: `Successful retrieved reservation of flight ${flight} at seat ${seat}.`,
      });
      return;
    }
  }
  res.status(404).json({
    status: 404,
    data: {},
    message: `Couldn't find the reservation of flight ${flight} at seat ${seat}.`,
  });
  return;
};

const getSingleReservationById = (req, res) => {
  const { id } = req.params;
  // return the reservation by id
  let r;
  for (r of reservations) {
    //console.log(r);
    if (r["id"] === id) {
      res.status(200).json({
        status: 200,
        data: r,
        message: `Successfully retrieved reservation with id ${id}.`,
      });
      return;
    }
  }
  res.status(404).json({
    status: 404,
    data: {},
    message: `Couldn't find the reservation by id ${id}.`,
  });
  return;
};

const addReservations = (req, res) => {
  // check and add the reservation to the server
  // return the data if validated
  // Allowing multple subscription from a same email/name since that's common

  /*  The structure of input should be like:    
  {
    flight: "SA231",
    seat: "9E",
    givenName: "Michale",
    surname: "Fly",
    email: "flying@dmail.com",
  } 
    with no data missing
    */
  let { flight, seat, givenName, surname, email } = req.body;
  // generate an unique id using uuidv4
  // verify the info again just to be safe
  if (!Object.keys(flights).includes(flight)) {
    res.status(404).json({
      status: 404,
      data: {},
      message: `There is no flight ${flight}.`,
    });
    return;
  }
  // verify surname and firstname
  if (!(surname && givenName)) {
    res.status(400).json({
      status: 400,
      data: {},
      message: `Part of name is missing.`,
    });
    return;
  }
  // verify email
  if (!email.includes("@")) {
    res.status(400).json({
      status: 400,
      data: {},
      message: `Email in bad format.`,
    });
  }
  // loop to check flight's seat exist or not
  let s;
  for (s of flights[flight]) {
    // find the seat and
    if (s["id"].toLowerCase() === seat.toLowerCase()) {
      // seat is available
      if (s["isAvailable"]) {
        // get a unique reservation id
        let new_id = uuidv4();
        // ensure uniqueness
        while (reservations_id.includes(new_id)) {
          new_id = uuidv4();
        }
        // create a new reservation
        let new_res = {
          id: uuidv4(),
          flight: `${flight}`,
          seat: `${seat}`,
          givenName: `${givenName}`,
          surname: `${surname}`,
          email: `${email}`,
        };
        // push to reservation and save to id
        reservations.push(new_res);
        reservations_id.push(new_id);
        // make the seat not available
        s["isAvailable"] = false;
        //console.log(reservations);
        // respond to front end
        res.status(201).json({
          status: 201,
          data: new_res,
          message: `Successfully added the reservation to flight ${flight} seat ${seat}`,
        });
        return;
      } else {
        res.status(409).json({
          status: 409,
          data: {},
          message: `The seat ${seat} of flight ${flight} was already by taken.`,
        });
        return;
      }
    }
  }
  // if after loop and it's not returned, then we didn't find the seat
  res.status(404).json({
    status: 404,
    data: {},
    message: `The seat ${seat} of flight ${flight} was not found.`,
  });
  return;
};

const deleteReservation = (req, res) => {
  // 2 expected "method" attribute:
  // 1. by id   2.by flight and seat
  // The indication should be stored in the body of request: FS for flight and seat; ID for reservation id
  // FS body: {flight:xxx, seat:xxx}
  // id body: {id:xxx}
  let del_info = req.body;
  let method_find = del_info["method"];

  // switch by flag
  if (method_find === "FS") {
    // find by flight & seat and delete
    let { flight, seat } = del_info;
    // get the index of r
    if (!(flight && seat)) {
      // not enough info given
      res.status(400).json({
        status: 400,
        data: del_info,
        message: `Flight or seat identifier missing!`,
      });
      return;
    }
    // find the reservation with flight and seat
    let r_found = reservations.findIndex((ele) => {
      return ele["flight"] === flight && ele["seat"] === seat;
    });
    // do the operation
    if (r_found >= 0) {
      // remove by index
      let removed = reservations.splice(r_found, 1)[0];
      // remove id from reservation_id
      for (let n = 0; n < reservations_id.length; n++) {
        if (reservations_id[n] === removed.id) {
          reservations_id.splice(n, 1);
          break;
        }
      }
      res.status(200).json({
        status: 200,
        data: removed,
        message: `Successfully delete reservation with flight ${flight} and seat ${seat}`,
      });
      return;
    } else {
      res.status(404).json({
        status: 404,
        data: del_info,
        message: `Didn't find reservation with flight ${flight} and seat ${seat}.`,
      });
    }
    return;
  } else if (method_find === "ID") {
    // find by id and delete
    let { id } = del_info;
    // do the operation
    if (!id) {
      res.status(400).json({
        status: 400,
        data: del_info,
        message: `Id is not given!`,
      });
      return;
    }
    let r_found = reservations.findIndex((ele) => {
      return ele["id"] === id;
    });
    if (r_found >= 0) {
      let removed = reservations.splice(r_found, 1)[0];
      // remove id from reservation_id
      for (let n = 0; n < reservations_id.length; n++) {
        if (reservations_id[n] === removed.id) {
          reservations_id.splice(n, 1);
          break;
        }
      }
      res.status(200).json({
        status: 200,
        data: removed,
        message: `Successfully delete reservation with id ${id}`,
      });
      return;
    } else {
      res.status(404).json({
        status: 404,
        data: del_info,
        message: `Didn't find reservation with id ${id}.`,
      });
    }
    return;
  } else {
    res.status(404).json({
      status: 404,
      data: del_info,
      message: `${method_find} is not a method supported.`,
    });
    return;
  }
};

const updateReservation = (req, res) => {
  // expection the body:
  // 1. reservation id 2.flight and seat number
  // the body would be expected to be like
  /* 
  {
    method: FS / ID,
    method_info: {
      flight: xxx,
      seat: xxx,

      OF

      id: xxx
    },
    updateInfo : {
      [attribute1]:new_value1
      [attribute2]:new_value2
    }
  }
  */

  if (Object.keys(req.body).length === 0) {
    res.status(400).json({
      status: 400,
      data: {},
      message: `No body detected!`,
    });
    return;
  }

  let info = req.body;
  let method_find = info["method"];
  let method_info = info["method_info"];
  let update_info = info["updateInfo"];

  if (Object.keys(update_info).length === 0) {
    res.status(204).json({
      status: 204,
      data: info,
      message: `There is nothing to update!`,
    });
    return;
  }

  // get the reservation
  let r_update = {};
  if (method_find === "FS") {
    let { flight, seat } = method_info;
    // check flight and seat
    if (!flight || !seat) {
      res.status(404).json({
        status: 404,
        data: info,
        message: `The flight or the seat is not given!`,
      });
      return;
    }
    // find the update
    r_update = reservations.findIndex((ele) => {
      return ele["flight"] === flight && ele["seat"] === seat;
    });
    // if not found resolve immediately
    if (r_update < 0) {
      res.status(404).json({
        status: 404,
        data: info,
        message: `The reservation with flight ${flight} and seat ${seat} is not found!`,
      });
      return;
    }
  } else if (method_find === "ID") {
    let { id } = method_info;
    // check id
    if (!id) {
      res.status(404).json({
        status: 404,
        data: info,
        message: `The id is not given!`,
      });
      return;
    }
    // find the update
    r_update = reservations.findIndex((ele) => {
      return ele["id"] === id;
    });
    // if not found resolve immediately
    if (r_update < 0) {
      res.status(404).json({
        status: 404,
        data: info,
        message: `The reservation with id ${id} is not found!`,
      });
      return;
    }
  } else {
    res.status(404).json({
      status: 404,
      data: info,
      message: `${method_find} is not a method supported.`,
    });
    return;
  }
  // found and update by corresponding keys
  // at this point it shouldn't be less than 0
  if (r_update >= 0) {
    // get a set of keys
    let res_key = Object.keys(reservations[r_update]);

    // grab the location of reservation
    for (var k of Object.keys(update_info)) {
      // check if k is in the reservation key
      if (!res_key.includes(k)) {
        res.status(400).json({
          status: 400,
          data: info,
          message: `${k} is not a attribute of reservation`,
        });
        return;
      }
      // forbidden the change of id
      if (k == "id") {
        res.status(403).json({
          status: 403,
          data: info,
          message: `You have no permission to change reservation id!`,
        });
        return;
      }
      // if it's the email that's updated, validate for @ (may be done in the front end but it's safer)
      if (k === "email") {
        if (!update_info[k].includes("@")) {
          res.status(403).json({
            status: 403,
            data: info,
            message: `Email has incorrect format!`,
          });
          return;
        }
      }

      // actual update
      reservations[r_update][k] = update_info[k];
    }
    // respond to frontend
    res.status(200).json({
      status: 200,
      data: reservations[r_update],
      message: `The reservation with id ${reservations[r_update]["id"]}, flight ${reservations[r_update]["flight"]}, seat ${reservations[r_update]["seat"]} is updated!`,
    });
    return;
  }
};

module.exports = {
  getFlights,
  getFlight,
  getReservations,
  addReservations,
  getSingleReservationByFS,
  getSingleReservationById,
  deleteReservation,
  updateReservation,
};
