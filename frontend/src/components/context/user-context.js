import React from "react";

export const UserContext = React.createContext({
    username: null,
    setUsername: () => {},
    token: null,
    setToken: () => {}
})

const UserContextProvider = (props) => {
    const [username, setUsername] = React.useState(null)
    const [token, setToken] = React.useState(null)

    const value = { username, setUsername, token, setToken }


    return <UserContext.Provider value={value}>
        {props.children}
    </UserContext.Provider>
}

export default UserContextProvider