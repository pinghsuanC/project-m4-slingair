import React, { useEffect, useState } from "react";
import { Redirect, useLocation } from "react-router-dom";
import { useHistory } from "react-router-dom";
import FlightSelect from "./FlightSelect";
import Form from "./Form";

const initialState = { seat: "", givenName: "", surname: "", email: "" };

const SeatSelect = ({ updateUserReservation }) => {
  let history = useHistory();
  const [flightNumber, setFlightNumber] = useState(null);
  const [formData, setFormData] = useState(initialState);
  const [disabled, setDisabled] = useState(true);
  const [subStatus, setSubStatus] = useState("idle");
  const [push, setPush] = useState(false);

  //console.log(flightNumber, formData);
  useEffect(() => {
    // This hook is listening to state changes and verifying whether or not all
    // of the form data is filled out.
    Object.values(formData).includes("") || flightNumber === ""
      ? setDisabled(true)
      : setDisabled(false);
  }, [flightNumber, formData, setDisabled]);

  const handleFlightSelect = (ev) => {
    //console.log("The flight number is set to : " + ev.target.value);
    setFlightNumber(ev.target.value);
  };

  const handleSeatSelect = (seatId) => {
    setFormData({ ...formData, seat: seatId });
  };

  const handleChange = (val, item) => {
    setFormData({ ...formData, [item]: val });
  };

  const validateEmail = () => {
    const emailParts = formData.email.split("@");
    return (
      emailParts.length === 2 &&
      emailParts[0].length > 0 &&
      emailParts[1].length > 0
    );
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    //console.log(flightNumber);
    if (validateEmail()) {
      // TODO: Send data to the server for validation/submission
      // create a post request
      const postOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ flight: flightNumber, ...formData }),
      };
      fetch("/reservations", postOptions)
        .then((info) => info.json())
        .then((info) => {
          let { status, data, message } = info;
          if (status === 201) {
            // TODO: if 201, add reservation id (received from server) to localStorage
            localStorage.setItem("id", data.id);
            setFormData(initialState);
            // TODO: if 201, redirect to /confirmed (push)
            history.push({
              pathname: "/confirmed",
              state: { detail: data },
            });
          } else {
            console.log(message);
          }
        });
    }
  };

  return (
    <>
      <FlightSelect
        flightNumber={flightNumber}
        handleFlightSelect={handleFlightSelect}
      />
      <h2>Select your seat and Provide your information!</h2>
      <Form
        flightNumber={flightNumber}
        formData={formData}
        handleChange={handleChange}
        handleSeatSelect={handleSeatSelect}
        handleSubmit={handleSubmit}
        disabled={disabled}
        subStatus={subStatus}
      />
    </>
  );
};

export default SeatSelect;
