import React from 'react';
import { Box, TextField, Typography, Button } from "@mui/material";
import { UserContext } from './context/user-context'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const Profile = () => {
    const userContext = React.useContext(UserContext);
    const username = userContext.username;

    return (
        <Box
            display={"flex"}
            flexDirection={"column"}
            width={"50%"}
            margin={"auto"}
            border={"solid #e2f0f1 2px"}
            borderRadius={"5%"}
            padding={"50px 100px"}
        >
            <AccountCircleIcon sx={{fontSize: 150, margin: 'auto' }}/>
            <Typography variant={"h4"} sx={{padding: '2rem 0', margin: 'auto'}}>
                {username}
            </Typography>
            <Button variant="contained" sx={{textTransform: 'none', fontSize: '1.5rem'}}>Change Password</Button>
        </Box>
    )

}

export default Profile;