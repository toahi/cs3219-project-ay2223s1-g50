import React, { useEffect, useState, useContext } from 'react'
import {
  Box,
  Badge,
  Button,
  ButtonGroup,
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
import Badge_bs from 'react-bootstrap/Badge'
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import Cookies from 'js-cookie'

import { UserContext } from './context/user-context'
import {
  URI_COLLABORATION_SVC,
  URI_CHAT_SVC,
} from '../configs'
import Timer from './ui/Timer'
import { io as Client } from 'socket.io-client'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { COOKIE_INTERVIEW_SESSION } from '../configs'

const Interview = () => {
  let { username, token } = useContext(UserContext)
  const navigate = useNavigate()
  const [swap, setSwap] = useState(true)
  const [messagesCount, setMessageCount] = useState(0)
  const [isUserLeft, setIsUserLeft] = useState(false)

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

  /// Check if the other user has left
  const userLeftDialog = (
    <Dialog open={isUserLeft} onClose={() => setIsUserLeft(false)}>
        <DialogContent>
            <DialogContentText>Looks like the other person has navigated away from this page </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button>Okay</Button>
        </DialogActions>
    </Dialog>
  )

  useEffect(() => {
    if (usersInRoom.length === 1 && usersInRoom[0] === username) {
      setIsUserLeft(true)
    }

    if (usersInRoom.length === 2) {
      setIsUserLeft(false)
    }

    return () => {}
  }, [usersInRoom])

  /// Difficulty badge
  const difficultyBadge = () => {
    let variant

    switch (difficulty) {
      case ("easy"):
        variant = "success"
        break
      case ("medium"):
        variant = "warning"
        break
      case ("hard"):
        variant = "danger"
        break
      default:
        variant = "dark"
    }

    return <Badge_bs bg={variant}>{difficulty ?? "unknown"}</Badge_bs>
  }
  
  /// Solution button
  const solutionButton = (title) => {
    return (
    <Button
      sx={{
        fontSize: '1rem',
        marginLeft: '2rem',
        backgroundColor: 'black',
      }}
      variant="contained"
      onClick={() =>
        window.open(
          `https://www.google.com/search?q=leetcode+${title}+solution`,
          '_blank'
        )
      }
    >
      SOLUTION
    </Button>
    )
  }

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

  /// Layout for question
  const questionBox = (title, body, example) => (
    <Box
      sx={{
        border: 'solid black 2px',
        borderRadius: '1%',
        padding: 5,
        marginBottom: '1rem',
        height: '800px',
        minWidth: '400px',
        maxWidth: '700px',
        overflow: 'scroll',
      }}
      key={`${title}${body}`}
    >
      {difficultyBadge()}
      <Typography sx={{ whiteSpace: 'pre-line' }}>
        <Typography sx={{ fontWeight: 'bold', fontSize: '2rem' }}>
          {title}
          {solutionButton(title)}
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
      setMessageCount(prev => prev + 1)
    })

    return () => {
      tempChatClient.close()
    }
  }, [])

  /// Chat dialog stuff
  const [message, setMessage] = useState('')
  const [isChatOpen, setIsChatOpen] = useState(false)
  const sendMessage = () => {
    if (message.length === 0) return
    chatClient?.emit(ChatEvents.RoomMessage, {
      roomId,
      message,
    })
    setMessages((prev) => [...prev, { from: username, message }])
    setMessage('')
  }
  const chatButton = (
    <Button
      sx={{ fontSize: '1rem', marginLeft: 'auto', backgroundColor: 'black' }}
      variant="contained"
      onClick={() => {
        setIsChatOpen(true)
        setMessageCount(0)
      }}
    >
    <Badge sx={{marginRight: "10px"}} color="primary" badgeContent={messagesCount}>
        <ChatBubbleIcon />
    </Badge>
      Chat
    </Button>
  )
  const chatMessage = ({ from, message }) => (
    <Card key={`${from}${message}`} sx={{display: "flex", margin: "0.5rem 0"}}>
      {from === username && <CardHeader avatar={userAvatar(from)} />}
      <CardContent sx={{margin: "auto", width: "300px", overflowWrap: "break-word"}}>{message}</CardContent>
      {from !== username && <CardHeader avatar={userAvatar(from)} />} {/* Flip icon pos if not sender */}
    </Card>
  )

  const chatDialog = (
    <Dialog
      open={isChatOpen}
      scroll="paper"
      onClose={() => {
        setIsChatOpen(false)
        setMessageCount(0)
      }}
    >
      <DialogTitle sx={{textAlign: "center"}}>Chat</DialogTitle>
      <DialogContent dividers>{messages.map(chatMessage)}</DialogContent>
      <DialogActions>
        <TextField
          sx={{flexGrow: "1"}}
          multiline
          aria-multiline
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button 
          sx={{margin:"0 0.5rem"}}
          onClick={() => sendMessage()}
          variant="contained"
        >
          Send
        </Button>
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

  const swapDisplayButton = (
    <Button
      sx={{
        backgroundColor: 'black',
        margin: "0 20px"
      }}
      variant="contained"
      onClick={() => setSwap((prev) => !prev)}
    >
      SWAP DISPLAY
    </Button>
  )

  // code to run on window close
  return (
    <Box sx={{ margin: '4rem' }}>
      <Box
        sx={{ display: 'flex', flexDirection: 'row', padding: '0 0 2rem 0' }}
      >
        {userAvatars}
        {questionTimer()}
        <ButtonGroup sx ={{marginLeft: "auto"}}variant="text" aria-label="text button group">
          {chatButton}
          {swapDisplayButton}
          {leaveRoomButton}
        </ButtonGroup>
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
      {userLeftDialog}
    </Box>
  )
}

export default Interview
