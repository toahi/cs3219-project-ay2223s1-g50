import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { UserContext } from '../context/user-context';
import axios from 'axios';
import { URL_LOGOUT_USER_SVC } from '../../configs';

axios.defaults.withCredentials = true;

const NavBar = () => {
  const userContext = React.useContext(UserContext)
  const username = userContext.username
  
  const handleLogout = () => {
      axios.post(URL_LOGOUT_USER_SVC, { headers: { authorization: `Bearer ${userContext.token}` } }).then(res => {
        userContext.setUsername("test")
        userContext.setToken(null)
      })
  }

  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="/">
            <img
              alt=""
              src=""
              width="30"
              height="30"
              className="d-inline-block align-top"
            />{' '}
            Peer Prep
          </Navbar.Brand>
          <Nav className="justify-content-end">
            <Nav.Link href="/">Home</Nav.Link>
            { !username && <Nav.Link href="/login">Login</Nav.Link>}
            { !username && <Nav.Link href="/signup">Sign Up</Nav.Link>}
            { username && <Nav.Link>Hello {username}</Nav.Link>}
            { username && <Nav.Link href="/" onClick={handleLogout}>Logout</Nav.Link>}
          </Nav>
        </Container>
      </Navbar>
    </>
  );
}

export default NavBar;