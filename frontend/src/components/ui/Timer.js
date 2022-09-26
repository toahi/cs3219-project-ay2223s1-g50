import React from "react";

const Timer = () => {
    const [minutes, setMinutes] = React.useState(-1);
    const [seconds, setSeconds] = React.useState(0);
    const [inc, setInc] = React.useState(false);

    React.useEffect(() => {
        const myTimeout = setInterval(() => {setSeconds(prev => {
            if (prev === 59) {
                setInc(prev => !prev);
                return 0;
            }
            return prev + 1;
        })}, 1000);

        return () => {
            clearInterval(myTimeout)
        }
    }, []);

    React.useEffect(() => {
        setMinutes(prev => prev + 1);
    }, [inc])

    return <h1>{minutes}:{seconds}</h1>
}

export default Timer;