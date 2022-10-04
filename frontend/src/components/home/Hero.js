import classes from "./Hero.module.css";
import { Button } from "@mui/material";
const Hero = () => {
    return (
        <div className={classes.container}>
            <div className={classes["text-container"]} >
                <h1 className={classes.title}>Get hired at your dream job!</h1>
                <h3 className={classes.description}>PeerPrep prepares you for online technical interview by increasing your technical competence and confident so that you can land your dream job.</h3>
            <div className={classes["button-container"]}>
                <Button className={classes["button-learn-more"]} variant="text" style={{border: "black solid 1px", backgroundColor: "#FFFFFF", fontSize: "1.3rem", width: "45%", height: "4rem"}}>LEARN MORE</Button>
                <Button className={classes["button-sign-up"]} variant="contained" href="/signup" style={{fontSize: "1.3rem", width: "45%", height: "4rem"}}>SIGN UP</Button>
            </div>
            </div>
            <img className={classes.image} src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkqTCEe8NPl1pHhHt1DFy1OMtldq3P_RQ0qA&usqp=CAU" />
        </div>
    )
}

export default Hero;