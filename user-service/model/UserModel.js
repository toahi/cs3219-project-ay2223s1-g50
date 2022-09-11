import mongoose from 'mongoose';
import assert from 'assert';
import auth from '../auth.js';

const Schema = mongoose.Schema

const UserModelSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: Number,
        required: true,
    },
    refreshToken: {
        type: String,
        required: false,
    },
})

const UserModel = mongoose.model('UserModel', UserModelSchema);

const createUser = async (username, password) => {
    try {
        const newUser = new UserModel({
            username: username,
            password: password,
            role: auth.ROLES.User
        });
        newUser.save();
        return true;
    } catch (err) {
        console.log(`ERROR (DB could not create new user):\n ${err}`);
        return err;
    }
}

const findUser = async (username) => {
    try {
        const users = await UserModel.find({ username });
        assert(users.length == 1); // username should be unique
        return users[0];
    } catch (err) {
        console.log(`ERROR (DB could not find user):\n ${err}`);
        return err;
    }
}

const updateUser = async (user) => {
    try {
        await UserModel.findOneAndUpdate({ username: user.username }, user, { upsert: 'true' });
        return true;
    } catch (err) {
        console.log(`ERROR (DB could not update user):\n ${err}`);
        return err;
    }
}

const deleteUser = async (username) => {
    try {
        await UserModel.findOneAndDelete({ username });
        return true;
    } catch (err) {
        console.log(`ERROR (DB could not delete user):\n ${err}`);
        return err;
    }
}

export default { createUser, deleteUser, findUser, updateUser }; 
