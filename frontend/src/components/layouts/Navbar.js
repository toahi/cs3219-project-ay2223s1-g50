import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { UserContext } from '../context/user-context';
import axios from 'axios';
import { URL_LOGOUT_USER_SVC } from '../../configs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsersLine } from '@fortawesome/free-solid-svg-icons'
import Logo from '../ui/Logo';

axios.defaults.withCredentials = true;

const NavBar = () => {
  const userContext = React.useContext(UserContext)
  const username = userContext.username
  
  const handleLogout = () => {
      axios.post(URL_LOGOUT_USER_SVC, { headers: { authorization: `Bearer ${userContext.token}` } }).then(res => {
        userContext.setUsername(null)
        userContext.setToken(null)
      })
  }

  return (
    <>
      <Navbar bg="dark" variant="dark" className="py-2">
        <Container>
          <Navbar.Brand href="/">
            <Logo size="h4"/>
          </Navbar.Brand>
          <Nav className="justify-content-end">
          { username && <Nav.Link><h4>Hello {username}</h4></Nav.Link>}
            <Nav.Link href="/"><h4>Home</h4></Nav.Link>
            { !username && <Nav.Link href="/login"><h4>Login</h4></Nav.Link>}
            { !username && <Nav.Link href="/signup"><h4>Sign Up</h4></Nav.Link>}
            { username && <Nav.Link href="/" onClick={handleLogout}><h4>Logout</h4></Nav.Link>}
          </Nav>
        </Container>
      </Navbar>
    </>
  );
}

export default NavBar;