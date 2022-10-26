import React from "react";
import axios from "axios";
import {Navigate, Outlet} from "react-router-dom"
import {UserContext} from "../context/user-context"
import LoadingPage from "../LoadingPage"
import ValidateAuth from '../hooks/ValidateAuth'

axios.defaults.withCredentials = true;

const ExistingAuth = () => {
    const [isLoggedIn, setIsLoggedIn] = React.useState(null)
    const [isLoading, setIsLoading] = React.useState(true)
    const firstRender = React.useRef(true)
    const userContext = React.useContext(UserContext)

    React.useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false
        } else {
            setIsLoading(false)
        }
    } , [isLoggedIn])

    ValidateAuth(isLoggedIn => setIsLoggedIn(isLoggedIn))

    return isLoading ? <LoadingPage /> : isLoggedIn ? <Navigate replace to='/dashboard' /> : <Outlet />

}

export default ExistingAuth