import React from "react";
import {
  Container,
  Nav,
  Navbar,
  Form,
  Button,
  NavDropdown,
} from "react-bootstrap";
import { NavLink, Link } from "react-router-dom";
import Cookies from "js-cookie";
import { options } from "../../utils";
import AdminIcon from "../../assets/images/AdminIcon.png";
import Swal from "sweetalert2";

const NavBar = () => {
  let currentUser = JSON.parse(localStorage.getItem("user"));

  let elements = () => {
    if (currentUser) {
      let elements = options.filter((option) => {
        if (option.showWhen === true) return true;
        return option.showWhen === currentUser.role;
      });
      return elements;
    }
  };

  const logForCart = () => {
    Swal.fire({
      icon: "error",
      title: "Usuario no Registrado",
      text: "¡Hola! Tienes que iniciar sesión para agregar productos a tu carrito",
    }).then((result) => {
      window.location.replace("/login");
    });
  };

  const logout = () => {
    localStorage.clear();
    Cookies.remove(process.env.REACT_APP_COOKIE_NAME);
    window.location.replace("/");
  };

  return (
    <>
      <Navbar bg="light" expand="lg">
        <Container fluid>
          <Link to="/" className="text-decoration-none">
            <Navbar.Brand>MyPhone</Navbar.Brand>
          </Link>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: "100px" }}
              navbarScroll
            >
              {!currentUser ? (
                <div onClick={logForCart}>Carrito</div>
              ) : (
                <div href="#action2">
                  {elements().map((element) => (
                    <NavLink
                      key={element.path}
                      to={element.path}
                      className={({ isActive }) =>
                        isActive ? "activeLink" : "link"
                      }
                      style={{ textDecoration: "none" }}
                    >
                      {element.label}
                    </NavLink>
                  ))}
                </div>
              )}

              <NavDropdown title="Link" id="navbarScrollingDropdown">
                <NavDropdown.Item href="#action3">Action</NavDropdown.Item>
                <NavDropdown.Item href="#action4">
                  Another action
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action5">
                  Something else here
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
            <NavDropdown id="navbarScrollingDropdown">
              <div>
                {!currentUser ? (
                  <div>
                    <div>
                      <Link to="/register">Registrase</Link>
                    </div>
                    <div>
                      <Link to="/login">Ingresar</Link>
                    </div>
                  </div>
                ) : (
                  <div>
                    <img
                      src={
                        currentUser.profile_picture
                          ? currentUser.profile_picture
                          : AdminIcon
                      }
                      alt={
                        currentUser.profile_picture
                          ? currentUser.profile_picture
                          : AdminIcon
                      }
                      className={
                        currentUser.role === "superadmin"
                          ? "mainIcon"
                          : "userIcon"
                      }
                      style={{ width: "5rem" }}
                    ></img>
                    <NavDropdown.Item onClick={logout}>
                      Cerrar sesión
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="#action5">
                      Configuracion
                    </NavDropdown.Item>
                  </div>
                )}
              </div>
            </NavDropdown>
            <Form className="d-flex">
              <Form.Control
                type="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
              />
              <Button variant="outline-success">Search</Button>
            </Form>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default NavBar;
