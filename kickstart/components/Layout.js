import React from "react";
import Header from "./Header";
import { Container } from "semantic-ui-react";

const Layout = (props) => {
  return (
    <Container>
      <Header></Header>
      {props.children}
    </Container>
  );
};
export default Layout;
