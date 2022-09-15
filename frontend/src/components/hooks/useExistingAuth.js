import React from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom"
import {UserContext} from "../context/user-context"
import {URL_VALIDATE_SESSION_SVC} from "../../configs"

axios.defaults.withCredentials = true;

const useExistingAuth = () => {
    const [isLoggedIn, setIsLoggedIn] = React.useState(null)
    const navigate = useNavigate();
    const userContext = React.useContext(UserContext)

    React.useEffect(() => {
        const checkSession = async () => { 
            axios.get(URL_VALIDATE_SESSION_SVC).
            then(res => {
                if(res.data.loggedIn) {
                    userContext.setUsername(res.data.username)
                    userContext.setToken(res.data.token)
                    setIsLoggedIn(true)
                }
            })
        }
        checkSession()
    }, [])

    React.useEffect(() => {
        if (isLoggedIn) {
            navigate('/dashboard')
        }
    }, [isLoggedIn])

}

export default useExistingAuth