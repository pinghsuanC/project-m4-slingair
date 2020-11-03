import React, { useState, useEffect } from "react";
import styled from "styled-components";
import GlobalStyles, { themeVars } from "./GlobalStyles";

// server expecting:
/*{
  method: FS / ID,
  method_info: {
    flight: xxx,
    seat: xxx,

    OR

    id: xxx
  },
  updateInfo : {
    [attribute1]:new_value1
    [attribute2]:new_value2
  }
}
*/

// enable editing
const Profile = () => {
  const [val, setVal] = useState("");
  const [res, setRes] = useState({ status: 0, data: {}, message: "" });
  const [newData, setNewData] = useState({
    method: "ID",
    method_info: {
      id: "",
    },
    updateInfo: {},
  });
  const [val_sur, setValSur] = useState("");
  const [val_given, setValGiven] = useState("");
  const [val_email, setValEmail] = useState("");
  const [appear, setAppear] = useState(false);

  //let res_data = "";
  const handleClick = () => {
    // fetch from server
    fetch(`/reservations/${val}`)
      .then((info) => info.json())
      .then((info) => {
        setRes(info);
        setNewData({ ...newData, method_info: { id: info.data.id } });
        setAppear(!appear);
      });
  };

  const handleInput = () => {
    //console.log("here");
    let up = {};
    if (val_sur) {
      up["surname"] = val_sur;
    }
    if (val_given) {
      up["givenName"] = val_given;
    }
    if (val_email) {
      up["email"] = val_email;
    }
    const patchOptions = {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newData, updateInfo: { ...up } }),
    };
    fetch("/reservations", patchOptions)
      .then((info) => info.json())
      .then((info) => {
        console.log(info.message);
      });
    setAppear(!appear);
    setVal("");
  };

  return (
    <>
      <Wrapper>
        <label htmlFor="res-id">Enter Reservation Id to Submit editing: </label>
        <Input
          large
          id="res-id"
          value={val}
          onChange={(ev) => {
            setVal(ev.target.value);
          }}
        />{" "}
        <DivNote>
          Note: You are not allowed to edit id, flight and seat number.
        </DivNote>
        <Button onClick={handleClick}>Submit</Button>
      </Wrapper>
      {res.status === 200 && (
        <ResultWrap>
          <ul>
            <li>
              <Span>Reservation id: </Span>
              {res.data.id}
            </li>
            <li>
              <Span>Flight #: </Span>
              {res.data.flight}
            </li>
            <li>
              <Span>Seat #:</Span>
              {res.data.seat}
            </li>
            <li>
              <Span>Surname: </Span>
              {res.data.surname}
            </li>
            <li>
              <Span>Given name: </Span>
              {res.data.givenName}
            </li>
            <li>
              <Span>Email: </Span>
              {res.data.email}
            </li>
          </ul>
          {appear && (
            <ul>
              <li>
                <Span>Reservation id: </Span>
                {res.data.id}
              </li>
              <li>
                <Span>Flight #: </Span>
                {res.data.flight}
              </li>
              <li>
                <Span>Seat #: </Span>
                {res.data.seat}
              </li>
              <li>
                <Span>Surname: </Span>
                <Input
                  type="text"
                  value={val_sur}
                  onChange={(ev) => {
                    setValSur(ev.target.value);
                  }}
                />
              </li>
              <li>
                <Span>Given name: </Span>
                <Input
                  type="text"
                  value={val_given}
                  onChange={(ev) => {
                    setValGiven(ev.target.value);
                  }}
                />
              </li>
              <li>
                <Span>Email: </Span>
                <Input
                  type="email"
                  value={val_email}
                  onChange={(ev) => {
                    setValEmail(ev.target.value);
                  }}
                />{" "}
                {/*Ensure it's email*/}
              </li>
              <Button onClick={handleInput}>Submit Change</Button>
            </ul>
          )}
        </ResultWrap>
      )}
      {res.status !== 200 && <Wrapper>{res.message}</Wrapper>}
    </>
  );
};
const ResultWrap = styled.div`
  font-family: sans-serif;
  margin: 20px;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
`;
const DivNote = styled.div`
  font-family: sans-serif;
  color: white;
  margin-left: 20px;
  margin-bottom: 10px;
  font-size: 0.8em;
`;
const Span = styled.span`
  font-weight: 700;
`;
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
  height: ${(props) => (props.large ? "50px" : "40px")};
  width: ${(props) => (props.large ? "90%" : "50%")};
  margin: 10px;
`;
const InnerWrapper = styled.div`
  font-family: sans-serif;
  background: ${themeVars.background};
  margin: 10px;
`;

export default Profile;
