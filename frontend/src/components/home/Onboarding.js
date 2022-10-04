import React from "react";
import classes from "./Onboarding.module.css";
import Hero from "./Hero";

const Onboarding = () => {
    return <div className={classes.container}>
        <Hero />
    </div>
}

export default Onboarding;

{/* <h1 id="temp">Get hired at your dream job!</h1>
        <h2 className={classes["message-body"]}>PeerPrep prepares you for online technical interview by increasing your technical competence and confident so that you can land your dream job.</h2>
        <br />
        <h1>What is PeerPrep?</h1>
        <h2>PeerPrep is Singapore's #1 online platform for users to prepare for online coding interviews. Users can role play as the interviewer or the interviewee in a simulated online coding interview environment.</h2>
        <br />
        <h1>Getting started with PeerPrep is simple</h1>
        <h2>1. Choose a difficulty level</h2>
        <h3>Select from 3 difficulties: easy, medium and hard</h3>
        <h2>2. Find a match</h2>
        <h3>PeerPrep will match you with another user</h3>
        <h2>3. Showcase your skills</h2>
        <h3>Once you have a match, you can showcase your skills in solving the coding problems</h3>  */}