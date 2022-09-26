import React from "react";
import axios from "axios";
import {Navigate, Outlet} from "react-router-dom"
import {UserContext} from "../context/user-context"
import {URL_VALIDATE_SESSION_SVC} from "../../configs"
import LoadingPage from "../LoadingPage"

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

    React.useEffect(() => {
        const checkSession = async () => { 
            axios.get(URL_VALIDATE_SESSION_SVC).
            then(res => {
                if(res.data.loggedIn) {
                    userContext.setUsername(res.data.username)
                    userContext.setToken(res.data.token)
                    setIsLoggedIn(true)
                } else {
                    setIsLoggedIn(false);
                }
            })
        }
        checkSession()
    }, [])

    return isLoading ? <LoadingPage /> : isLoggedIn ? <Navigate replace to='/dashboard' /> : <Outlet />

}

export default ExistingAuth