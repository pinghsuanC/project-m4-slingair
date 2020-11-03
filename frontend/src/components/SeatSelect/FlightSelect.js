import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Input from "./Input";
import { themeVars } from "../GlobalStyles";

const FlightSelect = ({ handleFlightSelect }) => {
  const [flights, setFlights] = useState([]);
  const [show, setShow] = useState(false);
  const [btnFlight, setBtnFlight] = useState("Flights:");
  // handlers for buttons
  const handleBtnClick = () => {
    setShow(!show);
  };
  const handleFlightClick = (value) => {
    setBtnFlight(value);
    setShow(!show);
  };
  // fetch flight info from server
  useEffect(() => {
    // TODO: fetch the flight numbers
    fetch("/flights")
      .then((info) => info.json())
      .then((info) => setFlights(info.data));
  }, []);

  // return the dropdown menu & update the flightNumber when selected
  return (
    <Wrapper>
      <label htmlFor="flight">Flight Number :</label>
      {/* TODO: Create a dropdown from the flight numbers */}
      <DropDown>
        <DropDownBtn onClick={handleBtnClick}>{btnFlight}</DropDownBtn>
        <DropDownContent>
          {show &&
            flights.map((ele) => {
              return (
                <DropDownInner
                  value={ele}
                  key={ele}
                  onClick={(ev) => {
                    handleFlightSelect(ev);
                    handleFlightClick(ev.target.value);
                  }}
                >
                  {ele}
                </DropDownInner>
              );
            })}
        </DropDownContent>
      </DropDown>
    </Wrapper>
  );
};

const DropDown = styled.div`
  position: relative;
  display: inline-block;
`;
const DropDownBtn = styled.button`
  cursor: pointer;
`;
const DropDownContent = styled.div`
  position: absolute;
`;
const DropDownInner = styled.button`
  text-align: center;
  font-family: ${themeVars.headingFont};

  :hover {
    cursor: pointer;
    background: ${themeVars.desertSand};
  }
`;
const Wrapper = styled.div`
  background: ${themeVars.cadmiumRed};
  height: 80px;
  display: flex;
  align-items: center;
  padding: ${themeVars.pagePadding};
  margin-bottom: ${themeVars.pagePadding};
`;

export default FlightSelect;
