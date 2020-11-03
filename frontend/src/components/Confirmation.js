import { useEffect, useState } from "react";
import React from "react";
import styled from "styled-components";
import { themeVars } from "./GlobalStyles";
import tombstone from "../assets/tombstone.png";
import { useLocation } from "react-router-dom";
const Confirmation = () => {
  const [res, setRes] = useState("");
  const location = useLocation();
  useEffect(() => {
    setRes((res) => (res = location.state.detail));
  }, [location]);
  let id,
    email,
    flight,
    seat,
    surname,
    givenName = "";
  if (res) {
    console.log(res);
    id = res["id"];
    email = res["email"];
    flight = res["flight"];
    seat = res["seat"];
    surname = res["surname"];
    givenName = res["givenName"];
  }
  return (
    <Wrapper>
      <Div_middle>
        <Div_inner>Your flight is confirmed!</Div_inner>
        <Ul>
          <li>
            <Span>Reservation #: </Span>
            {id}
          </li>
          <li>
            <Span>Flight #: </Span>
            {flight}
          </li>
          <li>
            <Span>Seat #: </Span>
            {seat}
          </li>
          <li>
            <Span>Name: </Span>
            {`${givenName} ${surname}`}
          </li>
          <li>
            <Span>Email: </Span>
            {email}
          </li>
          <p></p>
          <p></p>
          <li>Please save your reservation number for future reference!</li>
        </Ul>
      </Div_middle>
      <Img src={tombstone} />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const Ul = styled.ul`
  margin: 20px;
  height: 230px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
`;
const Div_middle = styled.div`
  border: 3px solid ${themeVars.alabamaCrimson};
  width: 400px;
  height: 300px;
`;
const Div_inner = styled.h2`
  font-size: 1.8em;
`;
const Span = styled.span`
  font-weight: 600;
`;
const Img = styled.img`
  margin-top: 20px;
  width: 200px;
  height: auto;
`;

export default Confirmation;
