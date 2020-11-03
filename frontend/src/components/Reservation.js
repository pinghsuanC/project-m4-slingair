import React, { useState, useEffect } from "react";
import styled from "styled-components";
import GlobalStyles, { themeVars } from "./GlobalStyles";

const Reservation = () => {
  // given a reservation id, show all reservations
  const [res, setRes] = useState({ status: 0, data: {}, message: "" });
  const [val, setVal] = useState("");
  const handleChange = (ev) => {
    setVal(ev.target.value);
  };
  // handle submission
  const handleSubmission = () => {
    const getOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };
    // fetch the reservation by id
    fetch(`/reservations/${val}`)
      .then((info) => info.json())
      .then((info) => setRes(info));
  };
  let { id, flight, seat, givenName, surname, email } = res.data;
  return (
    <>
      <Wrapper>
        <label for="res-id">Please enter your reservation id: </label>
        <Input
          type="text"
          id="res-id"
          value={val}
          onChange={(ev) => handleChange(ev)}
        />
        <Button onClick={handleSubmission}>Submit</Button>
      </Wrapper>
      {res.status === 200 && (
        <Wrapper>
          <InnerWrapper>Your registration is as followed: </InnerWrapper>
          <InnerWrapper>Reservation Id: {id}</InnerWrapper>
          <InnerWrapper>Your givenName: {givenName}</InnerWrapper>
          <InnerWrapper>Your surname: {surname}</InnerWrapper>
          <InnerWrapper>Your email address: {email}</InnerWrapper>
          <InnerWrapper>The flight number: {flight}</InnerWrapper>
          <InnerWrapper>The seat number: {seat}</InnerWrapper>
        </Wrapper>
      )}
      {res.status !== 200 && res.status !== 0 && (
        <Wrapper>
          <InnerWrapper>{res.message}, Please check your input!</InnerWrapper>
        </Wrapper>
      )}
    </>
  );
};

const Wrapper = styled.div`
  font-family: sans-serif;
  margin: 20px;
`;
const Button = styled.button`
  margin-left: 20px;

  :hover {
    cursor: pointer;
  }
`;
const Input = styled.input`
  width: 90%;
  margin: 10px;
`;
const InnerWrapper = styled.div`
  font-family: sans-serif;
  background: ${themeVars.background};
  margin: 10px;
`;

export default Reservation;
