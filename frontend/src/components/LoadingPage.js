import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import CircularProgress from '@mui/material/CircularProgress';

const LoadingPage = () => {
    return (
        <div style={{ margin: 'auto', paddingTop: '15rem'}}>
        <Box sx={{ display: 'flex' }}>
            <h1>Loading...</h1>
            <CircularProgress />
        </Box>
        </div>
    )
}

export default LoadingPage