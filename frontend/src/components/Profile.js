import React, { useState, useEffect } from "react";
import styled from "styled-components";
import GlobalStyles, { themeVars } from "./GlobalStyles";

// enable editing
const Profile = () => {
  const [val, setVal] = useState("");
  const [res, setRes] = useState({ status: 0, data: {}, message: "" });

  const handleClick = () => {
    // fetch from server
    fetch(`/reservations/${val}`)
      .then((info) => info.json())
      .then((info) => {
        console.log(info);
        setRes(info);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <Wrapper>
        <label for="res-id">Enter Reservation Id to start: </label>
        <Input
          large
          id="res-id"
          value={val}
          onChange={(ev) => {
            setVal(ev.target.value);
          }}
        />
        <Button onClick={handleClick}>Submit</Button>
      </Wrapper>
      {res.status === 200 && <Wrapper>{res.message}</Wrapper>}
      {res.status !== 200 && <Wrapper>{res.message}</Wrapper>}
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
  width: ${(props) => (props.large ? "90%" : "20%")};
  margin: 10px;
`;
const InnerWrapper = styled.div`
  font-family: sans-serif;
  background: ${themeVars.background};
  margin: 10px;
`;

export default Profile;
