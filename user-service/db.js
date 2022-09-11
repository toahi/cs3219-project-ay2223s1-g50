import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import 'dotenv/config';

// let mongoDB = process.env.ENV == "PROD" ? process.env.DB_CLOUD_URI : process.env.DB_LOCAL_URI;
let MONGODB_URI = 'mongodb://localhost/app'; 

const open = async () => {
	if (process.env.NODE_ENV === 'test') {
		// use memory server for now for ease of dev
		const mongod = await MongoMemoryServer.create();
		MONGODB_URI = mongod.getUri();
	}

	await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
	mongoose.connection.on('connected', () => {
		console.log('mongoose now connected')
	});
	mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));
};

const close = async () => {
	await mongoose.disconnect();
}

export default { open, close };