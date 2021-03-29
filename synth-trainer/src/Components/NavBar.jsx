import { navigate } from "@reach/router";
import React from "react";
import { useContext } from "react";
import { Navbar, Nav, NavDropdown, Button } from "react-bootstrap";
import { signOut } from "../firebase";
import { UserContext } from "../providers/UserProvider";

const onClickHandler = (event) => {
  const { name } = event.currentTarget;
  if (name === "logOut") {
    try {
      signOut();
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  }
};

const NavigationBar = () => {
  const auth = useContext(UserContext);
  if (auth) {
    return (
      <Navbar bg="dark" expand="lg" variant="dark">
        <Navbar.Brand href="/">Synth Trainer</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
            <NavDropdown title="Modules" id="basic-nav-dropdown">
              <NavDropdown.Item href="/module1">Module 1</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">Module 2</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Module 3</NavDropdown.Item>
            </NavDropdown>
            <Nav.Link href="/profilePage">Profile</Nav.Link>
            <Nav.Link href="/sandbox">Sandbox</Nav.Link>
            {/* <Nav.Link href="#settings">Settings</Nav.Link> */}
            <Button
              name="logOut"
              variant="outline-light"
              onClick={(event) => onClickHandler(event)}
            >
              Log Out
            </Button>
          </Nav>
          {/* <Form inline>
            <FormControl type="text" placeholder="Search" className="mr-sm-2" />
            <Button variant="outline-info">Search</Button>
          </Form> */}
        </Navbar.Collapse>
      </Navbar>
    );
  } else {
    return (
      <Navbar bg="dark" expand="lg" variant="dark">
        <Navbar.Brand href="/">Synth Trainer</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
            <Nav.Link href="/sandbox">Sandbox</Nav.Link>
          </Nav>
          {/* <Form inline>
            <FormControl type="text" placeholder="Search" className="mr-sm-2" />
            <Button variant="outline-info">Search</Button>
          </Form> */}
        </Navbar.Collapse>
      </Navbar>
    );
  }
};
export default NavigationBar;
