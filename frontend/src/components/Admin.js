import React, { useEffect, useState } from "react";
import styled from "styled-components";

const Admin = () => {
  const [resu, setInfo] = useState({ status: 0, data: [], message: "" });
  useEffect(() => {
    fetch("/reservations")
      .then((info) => info.json())
      .then((info) => {
        console.log(info);
        setInfo(info);
      });
  }, []);

  return (
    <>
      <h1>These are all the reservations we have: </h1>
      {resu.status === 200 &&
        resu.data.map((ele) => {
          return <Section res={ele} />;
        })}
    </>
  );
};

const Section = ({ res }) => {
  return (
    <>
      <ResultWrap>
        <ul>
          <li>
            <Span>Reservation id: </Span>
            {res.id}
          </li>
          <li>
            <Span>Flight #: </Span>
            {res.flight}
          </li>
          <li>
            <Span>Seat #:</Span>
            {res.seat}
          </li>
          <li>
            <Span>Surname: </Span>
            {res.surname}
          </li>
          <li>
            <Span>Given name: </Span>
            {res.givenName}
          </li>
          <li>
            <Span>Email: </Span>
            {res.email}
          </li>
        </ul>
      </ResultWrap>
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
const Span = styled.span`
  font-weight: 700;
`;

export default Admin;
