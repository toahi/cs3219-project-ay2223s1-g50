import React, { useEffect, useState, useContext } from 'react'
import { Box, Button, Typography, TextareaAutosize } from '@mui/material'
import { UserContext } from './context/user-context'
import {
  URL_GET_TWO_QUESTIONS_BY_DIFF_QUESTION_SVC,
  URI_COLLABORATION_SVC,
} from '../configs'
import Timer from './ui/Timer'
import axios from 'axios'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { io as Client } from 'socket.io-client'
import { useNavigate, useLocation, useParams } from 'react-router-dom'

const Interview = () => {
  const userContext = useContext(UserContext)
  const token = userContext.token
  const navigate = useNavigate();

  const [questionsShown, setQuestionsShown] = useState({})
  const [editorText, setEditorText] = useState('')

  const { difficulty, roomId } = useParams()
  const {
    state: { questions },
  } = useLocation()

  const CollaborationEvent = {
    RoomMessage: 'collaboration:room_message',
    JoinRoom: 'collaboration:join_room',
    LeaveRoom: 'collaboration:leave_room'
  }
  const client = new Client(URI_COLLABORATION_SVC, {
    extraHeaders: {
      Authorization: `Bearer ${token}`,
    },
  })

  useEffect(() => {
    client.emit(CollaborationEvent.JoinRoom, {
      roomId,
    })
  })

  useEffect(() => {
    setQuestionsShown(questions)
  }, [questions])

  client.on(CollaborationEvent.RoomMessage, ({ from, message }) => {
    setEditorText(message)
  })

  const questionsBox = (questions) => (
    <>
      {questions?.questionOne?.map((question) =>
        questionBox(question.name, question.description, question.examples)
      )}
      {questions?.questionTwo?.map((question) =>
        questionBox(question.name, question.description, question.examples)
      )}
    </>
  )

  const questionBox = (title, body, example) => (
    <Box
      sx={{
        border: 'solid black 2px',
        borderRadius: '1%',
        maxWidth: "500px",
        padding: 5,
        marginBottom: "1rem",
        height: "400px",
        overflow: "scroll"
      }}
    >
      <Typography sx={{ whiteSpace: 'pre-line' }}>
        <Typography variant={'h5'} sx={{ fontWeight: 'bold' }}>
          {title}
        </Typography>
        <Typography sx={{ width: '80%', margin: '1.5rem 0' }}>
          {body}
        </Typography>
        {example}
      </Typography>
    </Box>
  )

  const getNewQuestion = async () => {
    const config = {
      headers: {
        authorization: 'Bearer ' + token,
      },
    }

    try {
      const { data: res } = await axios.post(
        URL_GET_TWO_QUESTIONS_BY_DIFF_QUESTION_SVC,
        { difficulty },
        config
      )
      setQuestionsShown(res)
    } catch (error) {
      console.error({ error })
    }
  }

  const leaveRoom = () => {
    navigate("/dashboard", { replace: true })
    client.emit(CollaborationEvent.LeaveRoom, {
      roomId,
    })
  }

  const questionTimer = (
    <>
      <AccessTimeIcon sx={{ fontSize: '3rem', margin: '0 0.5rem 0 1rem' }} />
      <Timer />
    </>
  )

  // Removed this until we add syncing up of questions through collab service
  // technology is not there yet :') LOL
  const getNextQuestionButton = (
    <Button
      sx={{ fontSize: '1rem' }}
      variant="outlined"
      onClick={() => getNewQuestion()}
    >
      NEXT QUESTION
    </Button>
  )

  const leaveRoomButton = (
    <Button
      sx={{ fontSize: '1rem', marginLeft: "auto", backgroundColor: "black" }}
      variant="contained"
      onClick={() => leaveRoom()}
    >
      <ExitToAppIcon sx={{margin: "0 5px 0 -5px"}}/>
      LEAVE
    </Button>
  )

  return (
    <Box sx={{ margin: '4rem' }}>
      <Box
        sx={{ display: 'flex', flexDirection: 'row', padding: '0 0 2rem 0' }}
      >
        {/* getNextQuestionButton was here */}
        {questionTimer}
        {leaveRoomButton}
      </Box>
      {/* TODO: Try to figure out why this doesn't change when questionsShown changes */}
      <Box sx={{display: "flex"}}>
      <Box>
        {questionsBox(questionsShown)}
      </Box>
        <TextareaAutosize
          onChange={(e) => {
            client.emit(CollaborationEvent.RoomMessage, {
              roomId,
              message: e.target.value,
            })
          }}
          aria-label="empty textarea"
          placeholder="Type your code here"
          value={editorText}
          style={{ flexGrow :'1', minHeight: '816px', margin: "0 1rem" }}
        />
      </Box>
    </Box>
  )
}

export default Interview
