/*Qs
  - why use localStorage (seems unnecessary) √
  - redirect using history or Redirect to confirmation page √
  - SlingAir API √
  - setState() why with const declaration, setmethods still works? √
    --> then why does useEffect work (how does it detect changes ?
  - prevent default throwing error 
*/

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
  BrowserRouter,
  Switch,
  Route,
  useHistory,
  useLocation,
} from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import SeatSelect from "./SeatSelect";
import Confirmation from "./Confirmation";
import GlobalStyles, { themeVars } from "./GlobalStyles";
import Reservation from "./Reservation";
import Profile from "./Profile";
import Admin from "./Admin";

const App = () => {
  const [userReservation, setUserReservation] = useState({});
  const [conData, setConData] = useState("");
  //const [number, setNumber] = useState(0);
  const updateUserReservation = (newData) => {
    setUserReservation({ ...userReservation, ...newData });
    setConData(newData);
    /*setNumber(number + 1);
    setNumber(number + 1);
    setNumber((number) => number + 1);
    setNumber((number) => number + 1);*/
    // setUserReservation(userReservation => {return { ...userReservation, ...newData }})
  }; // userReservation is a callback function

  useEffect(() => {
    // TODO: check localStorage for an id
    let id_new = localStorage.getItem("id");
    if (id_new) {
      updateUserReservation(id_new);
    }

    // if yes, get data from server and add it to state (???
  }, [setUserReservation]);

  return (
    <BrowserRouter>
      <GlobalStyles />
      <Header />
      <Main>
        <Switch>
          <Route exact path="/">
            <SeatSelect />
          </Route>
          <Route exact path="/confirmed">
            <Confirmation />
          </Route>
          <Route exact path="/view-reservation">
            <Reservation />
          </Route>
          <Route exact path="/admin">
            <Admin />
          </Route>
          <Route exact path="/profile">
            <Profile />
          </Route>
          <Route path="">404: Oops!</Route>
        </Switch>
        <Footer />
      </Main>
    </BrowserRouter>
  );
};

const Main = styled.div`
  background: ${themeVars.background};
  display: flex;
  flex-direction: column;
  height: calc(100vh - 110px);
`;

export default App;
