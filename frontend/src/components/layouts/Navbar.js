import React from 'react'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import axios from 'axios'
import Cookies from 'js-cookie'

import { UserContext } from '../context/user-context'
import { COOKIE_INTERVIEW_SESSION, URL_LOGOUT_USER_SVC } from '../../configs'
import Logo from '../ui/Logo'
import Badge from 'react-bootstrap/Badge'
import Button from 'react-bootstrap/Button'

const NavBar = () => {
  const userContext = React.useContext(UserContext)
  const username = userContext.username
  const token = userContext.token

  const logoLink = token ? '/signup' : '/about'

  const handleLogout = () => {
    axios
      .post(
        URL_LOGOUT_USER_SVC,
        {},
        { headers: { authorization: `Bearer ${userContext.token}` } }
      )
      .then((res) => {
        userContext.setUsername(null)
        userContext.setToken(null)
        Cookies.remove('token')
        Cookies.remove(COOKIE_INTERVIEW_SESSION)
      })
  }

  return (
    <div data-testid="navbar">
      <Navbar bg="dark" variant="dark" className="py-3">
        <Container>
          <Navbar.Brand href={logoLink}>
            <Logo size="h4" />
          </Navbar.Brand>
          <Nav className="justify-content-end">
            {username && (
              <Nav.Link href="/profile">
                <Badge bg="info">
                  <h5>{username}</h5>
                </Badge>
              </Nav.Link>
            )}
            {!username && (
              <Nav.Link href="/login">
                <Button variant="outline-light">
                  <h4>Login</h4>
                </Button>
              </Nav.Link>
            )}
            {!username && (
              <Nav.Link href="/signup">
                <Button variant="light">
                  <h4>Sign Up</h4>
                </Button>
              </Nav.Link>
            )}
            {username && (
              <Nav.Link href="/" onClick={handleLogout}>
                <h4>Logout</h4>
              </Nav.Link>
            )}
          </Nav>
        </Container>
      </Navbar>
    </div>
  )
}

export default NavBar
