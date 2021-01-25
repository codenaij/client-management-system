import React from "react";
import moment from "moment";
import { Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Navbar, Nav, NavDropdown, Container } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { logout } from "../actions/authActions";

const Header = () => {
  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const logoutHandler = () => {
    dispatch(logout());
  };
  return (
    // {userInfo && fullName = `${userInfo.data.user.firstName} ${userInfo.data.user.lastName}`}
    <header>
      <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>
              <i className="fas fa-book"></i> Bara Books
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto">
              {userInfo && userInfo.data.user.role !== "user" ? (
                <LinkContainer to="/">
                  <Nav.Link>Home</Nav.Link>
                </LinkContainer>
              ) : null}

              {userInfo &&
              (userInfo.data.user.role === "super-admin" ||
                userInfo.data.user.role === "hr") ? (
                <NavDropdown title="branch" id="basic-nav-dropdown">
                  <LinkContainer to="/branches">
                    <NavDropdown.Item>All Branches</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/create-branch">
                    <NavDropdown.Item>Create Branch</NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              ) : null}
              {userInfo &&
              (userInfo.data.user.role === "super-admin" ||
                userInfo.data.user.role === "hr") ? (
                <NavDropdown title="staff" id="basic-nav-dropdown">
                  <LinkContainer to="/register-staff">
                    <NavDropdown.Item>Create New Staff</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/all-staff">
                    <NavDropdown.Item>All Staff</NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              ) : null}
              {userInfo &&
              (userInfo.data.user.role === "super-admin" ||
                userInfo.data.user.role === "business-development" ||
                userInfo.data.user.role === "accounts") ? (
                <NavDropdown title="Contributions" id="basic-nav-dropdown">
                  <LinkContainer to="/contribution/new-contributor">
                    <NavDropdown.Item>Create New Contributor</NavDropdown.Item>
                  </LinkContainer>

                  <LinkContainer to="/all-contributors">
                    <NavDropdown.Item>All Contributors</NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              ) : null}
              {userInfo &&
              (userInfo.data.user.role === "super-admin" ||
                userInfo.data.user.role === "legal") ? (
                <NavDropdown title="Legal" id="basic-nav-dropdown">
                  <LinkContainer to="/contribution/legal">
                    <NavDropdown.Item>Generate MOU</NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              ) : null}
              {userInfo &&
              (userInfo.data.user.role === "super-admin" ||
                (userInfo && userInfo.data.user.role === "lead-accounts")) ? (
                <NavDropdown title="Accounts" id="basic-nav-dropdown">
                  <LinkContainer to="/investment-list">
                    <NavDropdown.Item>Generate ROI</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/contribution/receipt">
                    <NavDropdown.Item>Receipts</NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              ) : null}

              {userInfo ? (
                <NavDropdown
                  title={userInfo.data.user.firstName}
                  id="basic-nav-dropdown"
                >
                  <LinkContainer to="/profile">
                    <NavDropdown.Item>Profile</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={logoutHandler}>
                    <i className="fas fa-sign-out-alt"></i> Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <LinkContainer to="/login">
                  <Nav.Link>Sign In</Nav.Link>
                </LinkContainer>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
