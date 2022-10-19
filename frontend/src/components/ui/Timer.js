import React from "react";

const Timer = () => {
    const [seconds, setSeconds] = React.useState(0);

    React.useEffect(() => {
        const myTimeout = setInterval(() => {setSeconds(prev => {
            return prev + 1
        })}, 1000);

        return () => {
            clearInterval(myTimeout)
        }
    }, []);

    return <h1>{Math.floor((seconds/60))}:{("0" + (seconds % 60)).slice(-2)}</h1>
}

export default Timer;
