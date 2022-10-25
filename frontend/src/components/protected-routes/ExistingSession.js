import Cookies from "js-cookie";
import { Navigate, Outlet } from "react-router-dom"
import { COOKIE_INTERVIEW_SESSION } from "../../configs";

const ExistingSession = () => {
    const session = Cookies.get(COOKIE_INTERVIEW_SESSION);
    let roomId, difficulty, questions;
    
    if (session) {
        const sessionParams = JSON.parse(session)
        roomId = sessionParams.roomId
        difficulty = sessionParams.difficulty
        questions = sessionParams.questions
    }

    return (roomId && difficulty && questions) ? <Navigate to={`/interview/${difficulty}/${roomId}`} state={{questions}}  /> : <Outlet />
}

export default ExistingSession
