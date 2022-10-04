import classes from "./Hero.module.css";
import Button from 'react-bootstrap/Button';

const Hero = () => {
    return (
        <div className={classes.container}>
            <div className={classes["text-container"]}>
                <h1 className={classes.title}>Get hired at your dream job!</h1>
                <h3 className={classes.description}>PeerPrep prepares you for online technical interview by increasing your technical competence and confident so that you can land your dream job.</h3>
            <div className={classes["button-container"]}>
                <Button className={classes["button-learn-more"]} variant="primary">LEARN MORE</Button>{' '}
                <Button className={classes["button-sign-up"]} variant="light">SIGN UP</Button>{' '}
            </div>
            </div>
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkqTCEe8NPl1pHhHt1DFy1OMtldq3P_RQ0qA&usqp=CAU" />
        </div>
    )
}

export default Hero;