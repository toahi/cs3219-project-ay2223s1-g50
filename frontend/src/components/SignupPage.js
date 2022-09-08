import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    formGroupClasses,
    TextField,
    Typography,
} from "@mui/material";
import { useState } from "react";
import axios from "axios";
import { URL_USER_SVC } from "../configs";
import { STATUS_CODE_CONFLICT, STATUS_CODE_CREATED } from "../constants";
import { Link } from "react-router-dom";

function SignupPage() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [usernameIsEmpty, setUsernameIsEmpty] = useState(false);
    const [emailIsEmpty, setEmailIsEmpty] = useState(false);
    const [passwordIsEmpty, setPasswordIsEmpty] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogTitle, setDialogTitle] = useState("");
    const [dialogMsg, setDialogMsg] = useState("");
    const [isSignupSuccess, setIsSignupSuccess] = useState(false);

    const handleSignup = async () => {
        setIsSignupSuccess(false);
        setUsernameIsEmpty(false);
        setEmailIsEmpty(false);
        setPasswordIsEmpty(false);

        if (!username) {
            setUsernameIsEmpty(true);
        }
        if (!email) {
            setEmailIsEmpty(true);
        }
        if (!password) {
            setPasswordIsEmpty(true);
        }
        if (!username || !email || !password) {
            return;
        }

        const res = await axios
            .post(URL_USER_SVC, { username, password })
            .catch((err) => {
                if (err.response.status === STATUS_CODE_CONFLICT) {
                    setErrorDialog("This username already exists");
                } else {
                    setErrorDialog("Please try again later");
                }
            });
        if (res && res.status === STATUS_CODE_CREATED) {
            setSuccessDialog("Account successfully created");
            setIsSignupSuccess(true);
        }
    };

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
        setUsernameIsEmpty(false);
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
        setEmailIsEmpty(false);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
        setPasswordIsEmpty(false);
    };

    const closeDialog = () => setIsDialogOpen(false);

    const setSuccessDialog = (msg) => {
        setIsDialogOpen(true);
        setDialogTitle("Success");
        setDialogMsg(msg);
    };

    const setErrorDialog = (msg) => {
        setIsDialogOpen(true);
        setDialogTitle("Error");
        setDialogMsg(msg);
    };

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
                Sign Up
            </Typography>
            <TextField
                required
                error={usernameIsEmpty}
                label="Username"
                variant="standard"
                value={username}
                helperText={usernameIsEmpty && "Field cannot be empty."}
                onChange={handleUsernameChange}
                sx={{ marginBottom: "1rem" }}
                autoFocus
            />
            <TextField
                required
                error={emailIsEmpty}
                label="Email"
                variant="standard"
                value={email}
                helperText={emailIsEmpty && "Field cannot be empty."}
                onChange={handleEmailChange}
                sx={{ marginBottom: "1rem" }}
                autoFocus
            />
            <TextField
                required
                error={passwordIsEmpty}
                label="Password"
                variant="standard"
                type="password"
                value={password}
                helperText={passwordIsEmpty && "Field cannot be empty."}
                onChange={handlePasswordChange}
            />
            <Box
                display={"flex"}
                flexDirection={"row"}
                justifyContent={"flex-end"}
                marginTop={"2rem"}
            >
                <Button variant={"outlined"} onClick={handleSignup}>
                    Sign up
                </Button>
            </Box>

            <Dialog open={isDialogOpen} onClose={closeDialog}>
                <DialogTitle>{dialogTitle}</DialogTitle>
                <DialogContent>
                    <DialogContentText>{dialogMsg}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    {isSignupSuccess ? (
                        <Button component={Link} to="/login">
                            Log in
                        </Button>
                    ) : (
                        <Button onClick={closeDialog}>Done</Button>
                    )}
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default SignupPage;
