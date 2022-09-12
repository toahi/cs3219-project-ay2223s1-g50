import React from "react";
import {
    Box,
    Button,
    TextField,
    CircularProgress,
    Typography,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@mui/material";

import classes from "./LoginPage.module.css";

const LoginPage = () => {
    const [isLoading, setIsLoading] = React.useState(false);
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [usernameIsEmpty, setUsernameIsEmpty] = React.useState(false);
    const [passwordIsEmpty, setPasswordIsEmpty] = React.useState(false);
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [dialogEmail, setDialogEmail] = React.useState("")
    const [dialogText, setDialogText] = React.useState("")
    const [dialogEmailError, setDialogEmailError] = React.useState(false)

    // TODO
    // Validate credentials with database
    const handleLogin = () => {
        // Add validation logic here
        setUsernameIsEmpty(false);
        setPasswordIsEmpty(false);

        if (!username) {
            setUsernameIsEmpty(true);
        }
        if (!password) {
            setPasswordIsEmpty(true);
        }
        if (!(username || password)) {
            return;
        }

        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 2000);

        setPassword("");
    };

    /** Start of methods for forget password dialog*/
    const handleClose = () => {
        setIsDialogOpen(false);
        setDialogEmail("")
        setDialogEmailError(false)
    };

    const handleDialog = () => {
        
        if (!dialogEmail) {
            setDialogEmailError(true)
            setDialogText("Field cannot be empty")
            return
        }

        if (!(dialogEmail.includes("@"))) {
            setDialogEmailError(true)
            setDialogText("Invalid email format")
            return
        }

        // SEND LINK TO EMAIL
        alert("Check your email")
        handleClose()
    }

    const onDialogInputChange = (event) => {
        setDialogEmail(event.target.value)
        setDialogEmailError(false)
    } 
    /** End of methods for forget password dialog */

    const forgotPasswordDialog = (
        <Dialog open={isDialogOpen} onClose={handleClose}>
            <DialogTitle>Password Recovery</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Please enter your email to get your password reset link
                </DialogContentText>
                <TextField
                    error={dialogEmailError}
                    helperText={dialogEmailError && dialogText} 
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Email Address"
                    type="email"
                    fullWidth
                    variant="standard"
                    value={dialogEmail}
                    onChange={onDialogInputChange}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleDialog}>OK</Button>
            </DialogActions>
        </Dialog>
    );

    return (
        <Box
            display={"flex"}
            flexDirection={"column"}
            width={"50%"}
            margin={"auto"}
            border={"solid #e2f0f1 2px"}
            borderRadius={"5%"}
            padding={"100px"}
        >
            <Typography variant={"h3"} marginBottom={"2rem"}>
                Login
            </Typography>
            <TextField
                error={usernameIsEmpty}
                label="Username"
                helperText={usernameIsEmpty && "Field cannot be empty."}
                onChange={(event) => setUsername(event.target.value)}
                sx={{ marginBottom: "1rem" }}
                autoFocus
            />
            <TextField
                error={passwordIsEmpty}
                label="Password"
                helperText={passwordIsEmpty && "Field cannot be empty."}
                type="password"
                onChange={(event) => setPassword(event.target.value)}
                sx={{ marginBottom: "2rem" }}
            />
            <Typography
                variant={"subtitle2"}
                className={classes["forgot-password"]}
                onClick={() => setIsDialogOpen(true)}
            >
                Forgot Password
            </Typography>
            <Box
                display={"flex"}
                flexDirection={"row"}
                justifyContent={"flex-end"}
            >
                {isLoading ? (
                    <CircularProgress />
                ) : (
                    <Button variant="outlined" onClick={handleLogin}>
                        Login
                    </Button>
                )}
            </Box>
            {forgotPasswordDialog}
        </Box>
    );
};

export default LoginPage;
