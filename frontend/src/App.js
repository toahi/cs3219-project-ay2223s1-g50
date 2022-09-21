import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import SignupPage from './components/SignupPage';
import LoginPage from "./components/LoginPage";
import {Box} from "@mui/material";
import NavBar from "./components/layouts/Navbar";
import DashBoard from "./components/Dashboard";
import RequireAuth from "./components/protected-routes/RequireAuth";
import UserContextProvider from "./components/context/user-context";
import PageNotFound from "./components/PageNotFound";
import LoadingPage from "./components/LoadingPage";
import ExistingAuth from "./components/protected-routes/ExistingAuth";

function App() {

    return (
        <UserContextProvider>
        <div className="App">
            <NavBar />
            <Box display={"flex"} flexDirection={"column"} padding={"4rem"}>
                <Router>
                    <Routes>
                        <Route element={<ExistingAuth />}>
                            <Route exact path="/" element={<Navigate replace to="/signup" />} />
                            <Route path="/signup" element={<SignupPage />} />
                            <Route path="/login" element={<LoginPage />} />
                        </Route>
                        <Route path="/loading" element={<LoadingPage />} />

                        {/** Protected paths */}
                        <Route element={<RequireAuth />}>
                            <Route path="/dashboard" element={<DashBoard />}/>
                        </Route>

                        { /** TODO  */}
                        { /** CHECK WHY VALUES IN CONTEXT IS REMOVED WHEN PATH="*"  */}
                        <Route path='*' element={<PageNotFound />}/>
                    </Routes>
                </Router>
            </Box>
        </div>
        </UserContextProvider>
    );
}

export default App;