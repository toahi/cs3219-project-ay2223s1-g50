import React from "react";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    Typography,
} from "@mui/material";
import { useState, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Cookies from 'js-cookie'
import { useNavigate } from "react-router-dom";

import { UserContext } from "./context/user-context";
import { STATUS_CODE_SUCCESS } from "../constants";
import { URL_REGISTER_USER_SVC, URL_LOGIN_USER_SVC } from "../configs";
import { STATUS_CODE_CREATED, MIN_USERNAME_LEN, MIN_PASSWORD_LEN } from "../constants";
import classes from './LoginSignUpPage.module.css';
import Logo from "./ui/Logo"

function SignupPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [usernameIsEmpty, setUsernameIsEmpty] = useState(false);
    const [usernameIsInvalid, setUsernameIsInvalid] = useState(false);
    const [passwordIsEmpty, setPasswordIsEmpty] = useState(false);
    const [passwordIsInvalid, setPasswordIsInvalid] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogTitle, setDialogTitle] = useState("");
    const [dialogMsg, setDialogMsg] = useState("");
    const [isSignupSuccess, setIsSignupSuccess] = useState(false);

    const userContext = useContext(UserContext)
    const navigate = useNavigate;

    const validateUsername = (username) => {
        return String(username).length >= MIN_USERNAME_LEN;
    }

    const validatePassword = (password) => {
        return String(password).length >= MIN_PASSWORD_LEN;
    }

    const validateForm = () => {
        setUsernameIsEmpty(false);
        setUsernameIsInvalid(false);
        setPasswordIsEmpty(false);
        setPasswordIsInvalid(false);
        
        if (!username) {
            setUsernameIsEmpty(prev => {
                return !prev;
            });
        }
        if (username && !validateUsername(username)) {
            setUsernameIsInvalid(prev => {
                return !prev;
            });
        }
        if (!password) {
            setPasswordIsEmpty(prev => {
                return !prev;
            });
        }
        if (password && !validatePassword(password)) {
            setPasswordIsInvalid(prev => {
                return !prev;
            });
        }
        if (!username || !validateUsername(username) || !password || !validatePassword(password)) {
            return false;
        }

        return true;

    }
    const handleSignup = async () => {
        setIsSignupSuccess(false);

        if (!validateForm()) {
            return;
        }
    
        const res = await axios
            .post(URL_REGISTER_USER_SVC, { username, password })
            .catch((err) => {
                setErrorDialog(err.response.data.error);
            });
        if (res?.status === STATUS_CODE_CREATED) {
            setSuccessDialog("Account successfully created");
            setIsSignupSuccess(true);

            const res = await axios
            .post(URL_LOGIN_USER_SVC, { username, password})
            .catch(err => {
                setErrorDialog(err.response.data.error);
            })
            if (res?.status == STATUS_CODE_SUCCESS) {
                userContext.setUsername(username)
                userContext.setToken(res.data.accessToken)
                Cookies.set('token', res.data.accessToken)
                navigate('/dashboard')
            }
        }
    };

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
        setUsernameIsEmpty(false);
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
            margin={"4rem auto auto"}
            border={"solid #e2f0f1 2px"}
            borderRadius={"5%"}
            padding={"50px 100px 100px"}
        >
            <Logo size="h5" margin="0 auto 2rem"/>

            <Typography variant={"h4"} margin={"0 auto 2rem"}>
                Join PeerPrep today!
            </Typography>

            <TextField
                required
                error={usernameIsEmpty || usernameIsInvalid}
                label="Username"
                value={username}
                helperText={(usernameIsEmpty && "Field cannot be empty." )|| (usernameIsInvalid && "Username must have at least 6 characters")}
                onChange={handleUsernameChange}
                sx={{ marginBottom: "1rem" }}
                autoFocus
            />
            <TextField
                required
                error={passwordIsEmpty || passwordIsInvalid}
                label="Password"
                type="password"
                value={password}
                helperText={(passwordIsEmpty && "Field cannot be empty.")|| (passwordIsInvalid && "Password must have at least 6 characters")}
                onChange={handlePasswordChange}
            />
            <Typography
                variant={"subtitle2"}
                className={[classes["text-box"], classes.signup].join(' ')}
                component={Link} to="/login"
            >
                Already have an account? Click here to login
            </Typography>
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
                        <Button component={Link} to="/dashboard">
                            Continue
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
