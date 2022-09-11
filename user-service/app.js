import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import User from './model/UserModel.js'
import auth from './auth.js';

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors()); // config cors so that front-end can use
app.options('*', cors());

app.post('/register', async (req, res) => {
	const { username, password } = req.body;
	if (!username || !password) {
		return res.status(400).json({error: 'Please provide both username and password!'});
	}

	try {
		const result = await User.createUser(username, await bcrypt.hash(password, 10));
		if (result.err) {
			return res.status(500).json({error: 'Could not create new user!'});
		}
	} catch (err) {
		return res.status(500).json({error: 'Database failure when creating new user!'});
	}

	console.log(`Created new user ${username} successfully!`)
	return res.status(201).json({message: `Created new user ${username} successfully!`});
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
		return res.status(400).json({error: 'Please provide both username and password!' });
	}

    const user = await User.findUser(username);
    if (!user) {
		return res.status(401).json({error: 'Invalid username!' }); // Unauthorized code (authentication fail)
	}

    const isValidPassword = await bcrypt.compare(password, user.password);
	if (!isValidPassword) {
		return res.status(401).json({error: 'Invalid password!' }); // Unauthorized code (authentication fail)
	}

	// Create tokens
	const accessToken = jwt.sign(
		{
			"username": user.username,
			"role": Object.values(user.role)
		},
		process.env.JWT_ACCESS_TOKEN_SECRET,
		{ 
			expiresIn: '60m'
		}
	);

	// TODO
	// enable refresh token and shorten access token TTL, then handle everything (e.g. logout) with refresh token
	// const refreshToken = jwt.sign(
	// 	{ 
	// 		"username": user.username
	// 	},
	// 	process.env.JWT_REFRESH_TOKEN_SECRET,
	// 	{
	// 		expiresIn: '1d'
	// 	}
	// );
	
	// // give user refreshtoken
	// user.refreshToken = refreshToken;
	// User.updateUser(user);

	// const newUser = await User.findUser(username);
	// console.log(newUser);

	// res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 });
	res.json({ accessToken });
});

app.use(auth.validateAccessToken); // the actions below require authentication 

app.post('/logout', async (req, res) => {
	// client-side --> delete access/refresh token
	
	// blacklist token
	// using redis with TTL more than accessToken's time limit
	// blacklist token
	const blacklistAccessToken = (token) => {
		
	}
});

app.delete('/delete', async (req, res) => {
	// client-side --> delete access/refresh token

	// delete account
	// blacklist token
	// blacklist token
	const blacklistAccessToken = (token) => {
		
	}
});

app.put('/update', async (req, res) => {

});

app.get('/', (_, res) => res.send('Hello World from user-service'));

export default app;