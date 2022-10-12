
import {
    Box,
    Button,
    Typography,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@mui/material";
import React from "react";
import {useState} from "react";
import axios from "axios";
import {URL_SELECT_QUESTION_DIFFICULTY, URL_USER_SVC} from "../configs";
import {STATUS_CODE_BAD_REQUEST, STATUS_CODE_CONFLICT, STATUS_CODE_CREATED, STATUS_CODE_OK, STATUS_CODE_SUCCESS} from "../constants";
import { UserContext } from "./context/user-context";
import { Link, useNavigate } from "react-router-dom";


function Dashboard() {
    const navigate = useNavigate();
    const userContext = React.useContext(UserContext)
    const [isDashboardDialogOpen, setIsDashboardDialogOpen] = useState(false)
    const [dialogTitle, setDialogTitle] = useState("")
    const [dialogMsg, setDialogMsg] = useState("")
    const [isLoading, setIsLoading] = React.useState(false);
    const [questionDifficulty,setQuestionDifficulty] = useState("")



    const handleQuestion = async () => {
        setIsDashboardDialogOpen(false)
        setIsLoading(true)

        const res = await axios
            .post(URL_SELECT_QUESTION_DIFFICULTY, {questionDifficulty})
            .catch(err => {
                setErrorDialog(err.response.data.error);
            })
            if (res?.status == STATUS_CODE_SUCCESS) {
                userContext.setQuestionDifficulty(questionDifficulty)
                navigate('/interview-session')
        }

        setIsLoading(false) //not sure how to route loading page
    }

    const closeDialog = () => setIsDashboardDialogOpen(false);

    const dashboardDialog = <Dialog open={isDashboardDialogOpen} onClose={closeDialog}>
        <DialogTitle>{dialogTitle}</DialogTitle>
        <DialogContent>
            <DialogContentText>{dialogMsg}</DialogContentText>
        </DialogContent>
        <DialogActions>
                <Button onClick={closeDialog}>Done</Button>
        </DialogActions>
    </Dialog>

    const setErrorDialog = (msg) => {
        setIsDashboardDialogOpen(true);
        setDialogTitle("Error");
        setDialogMsg(msg);
    };


    return (
        <Box 
            display={"flex"} 
            alignitems={"center"}
            flexDirection={"column"} 
            flexShrink = {"0"}
            width={"100%"}
            alignment={"center"}
            justifyContent={"center"}
        >

            <Typography variant={"h3"} marginBottom={"2rem"} display={"flex"} alignitems= {"center"} >Welcome</Typography>
            <Typography variant={"subtitle1"} marginBottom = {"2rem"}>Please select your difficulty level</Typography> 

            <Box display={"flex"} flexDirection={"column"} >
                <Button variant={"outlined"} onClick={event => { setQuestionDifficulty("easy"); handleQuestion();}}>Easy</Button>
            </Box>
            <Box display={"flex"} flexDirection={"column"} >
                <Button variant={"outlined"} onClick={event => { setQuestionDifficulty("medium"); handleQuestion();}}>Medium</Button>
            </Box>
            <Box display={"flex"} flexDirection={"column"}>
                <Button variant={"outlined"} onClick={event => { setQuestionDifficulty("hard"); handleQuestion();}}>Hard</Button>
            </Box>
            {dashboardDialog}
        </Box>
    )
}

export default Dashboard;