import React, { useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  TextareaAutosize
} from "@mui/material";
import { UserContext } from "./context/user-context";
import { STATUS_CODE_SUCCESS } from "../constants"
import { URL_GET_TWO_QUESTIONS_BY_DIFF_QUESTION_SVC, URI_COLLABORATION_SVC } from "../configs";
import Timer from "./ui/Timer";
import axios from "axios";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { io as Client, Socket as ClientSocket } from 'socket.io-client'

const Interview = () => {
  const userContext = React.useContext(UserContext);
  const username = userContext.username;
  const token = userContext.token;

  const questionTitle = "Fizz Buzz\n\n";
  const questionBody = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."

  const client = new Client(URI_COLLABORATION_SVC, {
    extraHeaders: {
      Authorization: 'Bearer ' + token,
    },
  })
  useEffect(() => {
    client.emit('collaboration:join_room', {
      roomId: "1",
    });

  });

  client.on('collaboration:room_message',
    ({ from, message }) => {
      console.log(message)
    }
  );

  // TODO
  // Get next question from question service
  const getNewQuestion = async (difficulty) => {
    const config = {
      headers: {
        authorization: "Bearer " + token,
      },
    };
    const res = await axios
      .post(URL_GET_TWO_QUESTIONS_BY_DIFF_QUESTION_SVC, { difficulty }, config);
    // .catch(err => {
    //     setErrorDialog(err.response.data.error);
    // });
    console.log(res.data);
  }

  getNewQuestion('easy');

  return (
    <Box>
      <Box sx={{ display: 'flex', flexDirection: 'row', padding: '0 0 2rem 0' }}>
        <Typography variant={"h4"} sx={{ padding: '0 1rem 0 0' }}>
          Coding Question
        </Typography>
        <Button sx={{ fontSize: '1rem' }} variant="outlined" onClick={getNewQuestion}>
          GO NEXT
        </Button>
        <AccessTimeIcon sx={{ fontSize: '3rem', margin: '0 0.5rem 0 1rem' }} />
        <Timer />
      </Box>
      <Box sx={{ border: "solid black 2px", borderRadius: '1%', minWidth: '100%', padding: 3 }}>
        <Typography sx={{ whiteSpace: 'pre-line' }}>
          <Typography variant={"h5"}>
            {questionTitle}
          </Typography>
          {questionBody}
        </Typography>
      </Box>
      <Typography variant={"h4"} sx={{ padding: '2rem 0 0 0' }}>
        Code Editor
      </Typography>
      <TextareaAutosize
        onChange={ (e) => { client.emit('collaboration:room_message', { roomId: '1', message: e.target.value }) } }
        aria-label="empty textarea"
        placeholder="Type your code here"
        style={{ minWidth: '100%', minHeight: 500, marginTop: '1rem' }}
      />
    </Box>
  )
}

export default Interview;