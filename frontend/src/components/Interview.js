import React, { useEffect, useState, useContext } from 'react'
import {
  Box,
  Button,
  Typography,
  TextareaAutosize,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Tooltip,
  Avatar,
  Stack,
  Card,
  CardHeader,
  CardContent,
  TextField,
  IconButton,
} from '@mui/material'
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'
import { UserContext } from './context/user-context'
import {
  URL_GET_TWO_QUESTIONS_BY_DIFF_QUESTION_SVC,
  URI_COLLABORATION_SVC,
  URI_CHAT_SVC,
} from '../configs'
import Timer from './ui/Timer'
import axios from 'axios'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import ChatBubbleIcon from '@mui/icons-material/ChatBubble'
import MarkChatUnreadIcon from '@mui/icons-material/MarkChatUnread'
import { io as Client } from 'socket.io-client'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import Cookies from 'js-cookie'
import { COOKIE_INTERVIEW_SESSION } from '../configs'
import MarkChatUnread from '@mui/icons-material/MarkChatUnread'

const Interview = () => {
  const userContext = useContext(UserContext)
  const token = userContext.token
  const navigate = useNavigate()
  const [swap, setSwap] = useState(true)

  const { difficulty, roomId } = useParams()
  const {
    state: { questions },
  } = useLocation()

  /// Collab client stuff
  const [usersInRoom, setUsersInRoom] = useState([])
  const [collabClient, setCollabClient] = useState(undefined)
  const CollaborationEvent = {
    RoomMessage: 'collaboration:room_message',
    JoinRoom: 'collaboration:join_room',
    LeaveRoom: 'collaboration:leave_room',
  }
  useEffect(() => {
    const tempCollabClient = new Client(URI_COLLABORATION_SVC, {
      extraHeaders: {
        Authorization: `Bearer ${token}`,
      },
    })
    setCollabClient(tempCollabClient)
    tempCollabClient.emit(CollaborationEvent.JoinRoom, { roomId })
    tempCollabClient.on(CollaborationEvent.RoomMessage, ({ from, message }) => {
      setEditorText(message)
    })
    const setNewUsers = ({ users }) => setUsersInRoom(users)
    tempCollabClient.on(CollaborationEvent.JoinRoom, setNewUsers)
    tempCollabClient.on(CollaborationEvent.LeaveRoom, setNewUsers)

    return () => {
      tempCollabClient.close()
    }
  }, [])

  /// Question boxes
  const questionsBox = (questions) => {
    return (
      <Tabs defaultActiveKey="Question 1" id="questions-tab" className="mb-3">
        {questions?.questionOne?.map((question) => (
          <Tab eventKey="Question 1" title="Question 1">
            {questionBox(
              question.name,
              question.description,
              question.examples
            )}
          </Tab>
        ))}

        {questions?.questionTwo?.map((question) => (
          <Tab eventKey="Question 2" title="Question 2">
            {questionBox(
              question.name,
              question.description,
              question.examples
            )}
          </Tab>
        ))}
      </Tabs>
    )
  }

  const questionBox = (title, body, example) => (
    <Box
      sx={{
        border: 'solid black 2px',
        borderRadius: '1%',
        padding: 5,
        marginBottom: '1rem',
        height: '800px',
        overflow: 'scroll',
      }}
      key={`${title}${body}`}
    >
      <Typography sx={{ whiteSpace: 'pre-line' }}>
        <Typography sx={{ fontWeight: 'bold', fontSize: '2rem' }}>
          {title}
        </Typography>
        <Typography sx={{ width: '80%', margin: '1.5rem 0' }}>
          {body}
        </Typography>
        {example}
      </Typography>
    </Box>
  )

  /// Getting a new question stuff
  const [questionsShown, setQuestionsShown] = useState({})
  const [editorText, setEditorText] = useState('')
  useEffect(() => {
    setQuestionsShown(questions)
  }, [questions])

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
  const questionTimer = () => {
    const session = Cookies.get(COOKIE_INTERVIEW_SESSION)
    let startTime

    if (session) {
      startTime = JSON.parse(session).startTime
    }

    return (
      <>
        <AccessTimeIcon sx={{ fontSize: '3rem', margin: '0 0.5rem 0 1rem' }} />
        <Timer startTime={startTime} />
      </>
    )
  }

  /// Code editor
  const codeEditor = (
    <TextareaAutosize
      onChange={({ target: { value } }) => {
        collabClient?.emit(CollaborationEvent.RoomMessage, {
          roomId,
          message: value,
        })
        setEditorText(value)
      }}
      aria-label="empty textarea"
      placeholder="Type your code here"
      value={editorText}
      style={{
        flexGrow: '1',
        minHeight: '765px',
        margin: '4rem 1rem',
        padding: '1rem',
        resize: 'horizontal',
      }}
    />
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

  /// User Avatar stuff
  const userAvatar = (user) => (
    <Tooltip title={user} key={user}>
      <IconButton>
        <Avatar>{user[0]?.toUpperCase()}</Avatar>
      </IconButton>
    </Tooltip>
  )
  const userAvatars = (
    <Stack direction="row" spacing="2">
      {usersInRoom.map(userAvatar)}
    </Stack>
  )

  /// Chat client stuff
  const [messages, setMessages] = useState([])
  const ChatEvents = {
    RoomMessage: 'chat:room_message',
    JoinRoom: 'chat:join_room',
    LeaveRoom: 'chat:leave_room',
  }
  const [chatClient, setChatClient] = useState(undefined)
  useEffect(() => {
    const tempChatClient = new Client(URI_CHAT_SVC, {
      extraHeaders: {
        Authorization: `Bearer ${token}`,
      },
    })
    setChatClient(tempChatClient)
    tempChatClient.emit(ChatEvents.JoinRoom, { roomId })
    tempChatClient.on(ChatEvents.RoomMessage, (msg) => {
      setMessages((currMessages) => [...currMessages, msg])
      setIsChatUnread(true)
    })

    return () => {
      tempChatClient.close()
    }
  }, [])

  /// Chat dialog stuff
  const [message, setMessage] = useState('')
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isChatUnread, setIsChatUnread] = useState(false)
  const sendMessage = () => {
    if (message.length === 0) return
    chatClient?.emit(ChatEvents.RoomMessage, {
      roomId,
      message,
    })
    setMessage('')
  }
  const chatButton = (
    <Button
      sx={{ fontSize: '1rem', marginLeft: 'auto', backgroundColor: 'black' }}
      variant="contained"
      onClick={() => {
        setIsChatOpen(true)
        setIsChatUnread(false)
      }}
    >
      {isChatUnread ? (
        <MarkChatUnread sx={{ margin: '0 5px 0 -5px' }} />
      ) : (
        <ChatBubbleIcon sx={{ margin: '0 5px 0 -5px' }} />
      )}
      Chat
    </Button>
  )
  const chatMessage = ({ from, message }) => (
    <Card key={`${from}${message}`}>
      <CardHeader avatar={userAvatar(from)} />
      <CardContent>{message}</CardContent>
    </Card>
  )
  const chatDialog = (
    <Dialog
      open={isChatOpen}
      scroll="paper"
      onClose={() => {
        setIsChatOpen(false)
        setIsChatUnread(false)
      }}
    >
      <DialogTitle>Chat</DialogTitle>
      <DialogContent dividers>{messages.map(chatMessage)}</DialogContent>
      <DialogActions>
        <TextField
          multiline
          aria-multiline
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button onClick={() => sendMessage()}>Send</Button>
      </DialogActions>
    </Dialog>
  )

  /// Cleaning up
  const leaveRoom = () => {
    Cookies.remove(COOKIE_INTERVIEW_SESSION)
    navigate('/dashboard', { replace: true })
  }
  const leaveRoomButton = (
    <Button
      sx={{ fontSize: '1rem', marginLeft: 'auto', backgroundColor: 'black' }}
      variant="contained"
      onClick={() => leaveRoom()}
    >
      <ExitToAppIcon sx={{ margin: '0 5px 0 -5px' }} />
      LEAVE
    </Button>
  )

  // code to run on window close
  return (
    <Box sx={{ margin: '4rem' }}>
      <Box
        sx={{ display: 'flex', flexDirection: 'row', padding: '0 0 2rem 0' }}
      >
        {userAvatars}
        {/* getNextQuestionButton was here */}
        {questionTimer()}
        {chatButton}
        <Button
          sx={{
            fontSize: '1rem',
            marginLeft: 'auto',
            backgroundColor: 'black',
          }}
          variant="contained"
          onClick={() => setSwap((prev) => !prev)}
        >
          SWAP DISPLAY
        </Button>
        {leaveRoomButton}
      </Box>
      {/* TODO: Try to figure out why this doesn't change when questionsShown changes */}
      <Box sx={{ display: 'flex' }}>
        {swap && (
          <>
            {codeEditor}
            <Box>{questionsBox(questionsShown)}</Box>
          </>
        )}
        {!swap && (
          <>
            <Box>{questionsBox(questionsShown)}</Box>
            {codeEditor}
          </>
        )}
      </Box>
      {chatDialog}
    </Box>
  )
}

export default Interview
