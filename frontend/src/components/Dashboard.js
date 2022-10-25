import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  LinearProgress
} from '@mui/material'
import React from 'react'
import { useState } from 'react'
import { URI_MATCHING_SVC } from '../configs'
import { UserContext } from './context/user-context'
import { useNavigate } from 'react-router-dom'
import { io as Client } from 'socket.io-client'
import Card from "./ui/Card"
import Timer from './ui/Timer';
import Cookies from 'js-cookie';
import { COOKIE_INTERVIEW_SESSION } from '../configs'

function Dashboard() {
  const navigate = useNavigate()
  const userContext = React.useContext(UserContext)
  const [isFindingMatch, setIsFindingMatch] = useState(false)
  const [timeoutIds, setTimeoutIds] = React.useState([]);
  const [noMatch, setNoMatch] = useState(false)
  const MATCHMAKING_TIME = 30000;
  const token = userContext.token

  const MatchEvents = {
    FindMatch: 'find_match',
    MatchFound: 'match_found',
    CancelFindMatch: 'cancel_find_match',
  }
  const client = new Client(URI_MATCHING_SVC, {
    extraHeaders: {
      Authorization: `Bearer ${token}`,
    },
  })

  client.on(
    MatchEvents.MatchFound,
    async ({ roomId, difficulty, questions }) => {
      Cookies.set(COOKIE_INTERVIEW_SESSION, JSON.stringify({ roomId, difficulty, questions }))

      clearMatchMakingTimeouts()
      navigate(`/interview/${difficulty.toLowerCase()}/${roomId}`, {
        state: { questions },
      })
    }
  )

  const selectQuestionDifficulty = async (difficulty) => {
    setIsFindingMatch(true)
    setTimeoutIds(prev => [...matchmakingTimeout()])
    
    client.emit(MatchEvents.FindMatch, {
      difficulty,
    })
  }

  const closeDialog = () => {
    clearMatchMakingTimeouts()
    client.emit(MatchEvents.CancelFindMatch)
    setIsFindingMatch(false)
  }

  const matchmakingTimeout = () => {
    const id = setTimeout(closeDialog, MATCHMAKING_TIME); // 30000 = 30 seconds
    const id2 = setTimeout(() => setNoMatch(true), MATCHMAKING_TIME); // 30000 = 30 seconds
    return [id, id2];
  }

  const clearMatchMakingTimeouts = () => {
    clearTimeout(timeoutIds[0])
    clearTimeout(timeoutIds[1])
  }

  const dashboardDialog = (
    <Dialog open={isFindingMatch} onClose={closeDialog}>
      <Box sx={{display: "flex"}}>
      <DialogTitle>Finding a match...</DialogTitle>
      <Box sx={{marginTop:"0.5rem"}}>
        <Timer />
      </Box>
      </Box>
      <DialogContent>
        <LinearProgress />
        <DialogContentText>
          Please wait while we find you a match
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDialog}>Cancel</Button>
      </DialogActions>
    </Dialog>
  )

  const closeNoMatchDialog = () => {
    setNoMatch(false)
  }

  const noMatchDialog = (
    <Dialog open={noMatch} onClose={closeNoMatchDialog}>
      <DialogTitle>Unable to find a match</DialogTitle>
      <DialogContent sx={{display: "flex", flexDirection: "column"}}>
        <DialogContentText>
          Sorry, we could not find a peer for you :(
        </DialogContentText>
        <Box sx={{
                  height: "100px",
                  width: "100px",
                  margin: "2rem auto 0 auto",
                  borderRadius: "50%"
                }}
            component="img" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkqTCEe8NPl1pHhHt1DFy1OMtldq3P_RQ0qA&usqp=CAU"
          />
      </DialogContent>
      <DialogActions>
        <Button onClick={closeNoMatchDialog}>Cancel</Button>
      </DialogActions>
    </Dialog>
  )

  return (
    <Box>
      <Box
        display={'flex'}
        alignItems={'center'}
        flexDirection={'column'}
        flexShrink={'0'}
        width={'100%'}
        alignment={'center'}
        justifyContent={'center'}
        marginTop={'5%'}
      >
        <Typography
          variant={'h3'}
          marginBottom={'2rem'}
        >
          Welcome
        </Typography>
        <Typography variant={'subtitle1'} marginBottom={'2rem'}>
          Please select your difficulty level
        </Typography>
        <Box display={'flex'} sx={{padding:" 0 40%"}}>
          <Card 
              difficulty="Easy" 
              description="This difficulty is suitable for those who are getting started"
              img="https://cdn-icons-png.flaticon.com/512/2641/2641391.png"
              onClick={() => selectQuestionDifficulty("Easy")}
              disabled={isFindingMatch}/>
          <Card
              difficulty="Medium"
              description="This difficulty is suitable for those who wants to ramp up their skills"
              img="https://en.scratch-wiki.info/w/images/thumb/ScratchCat-Small.png/200px-ScratchCat-Small.png"
              onClick={() => selectQuestionDifficulty("Medium")}
              disabled={isFindingMatch}/>
          <Card
              difficulty="Hard"
              description="This difficulty is for those who wants to work in FAANG"
              img="https://assets.entrepreneur.com/content/3x2/2000/20150224165308-jeff-bezos-amazon.jpeg?crop=4:3"
              onClick={() => selectQuestionDifficulty("Hard")}
              disabled={isFindingMatch}/>
        </Box>
        {dashboardDialog}
        {noMatchDialog}
      </Box>
  </Box>
  )
}

export default Dashboard
