import bcrypt from 'bcrypt';
import {
  NextFunction,
  Request,
  Response,
} from 'express';
import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';

import {
  addUserToMongo,
  deleteUserByEmail,
  getUserByEmail,
} from '../models/user';

async function hashPassword(password) {
    const saltRounds = 10;

    try {
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    } catch (error) {
        throw createHttpError(500, 'Error hashing password');
    }
}

function generateToken(user) {
    // generate a timestamp for the token
    const timestamp = Date.now();
  
    // create the payload
    const payload = {
        user : user,
        timestamp : timestamp
    };

    // create the token
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
  
    return token;
}


export const registerUser = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        //check if the request body has the required attributes
        const { firstname,lastname,email,password } = req.body;
        if (!firstname || !lastname || !email || !password ) {
            throw createHttpError(403, 'No Attributes Provided');
        }
        const hashedPassword = await hashPassword(password);
        //check if the user already exists
        const temp = await getUserByEmail(email);
        if (temp) {
            throw createHttpError(403, 'User already exists');
        }
        //add the user to the database
        const user = await addUserToMongo(firstname, lastname, email, hashedPassword);
        //generate a token , but clear the password
        user.password = "secret";
        const token = generateToken(user);
        
        res.json({ token,user });
    } catch (error) {
        next(error);
    }
};

export const loginUser = async ( 
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        //check if the request body has the required attributes
        const { email, password } = req.body;
        if (!email || !password) {
            throw createHttpError(400, 'No Attributes Provided');
        }
        //check if the user exists
        const user = await getUserByEmail(email);
        if (!user) {
            throw createHttpError(400, 'User not found or Invalid password');
        }
        //check if the password is valid
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw createHttpError(400, 'User not found or Invalid password');
        }
        //generate a token , but clear the password
        user.password = "secret";
        const token = generateToken(user);
        

        res.json({ token,user });
    } catch (error) {
        next(error);
    }
}

export const deleteUser = async ( //not able to access though api, only for testing
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { email } = req.body;
        if (!email) {
            throw createHttpError(400, 'No Attributes Provided');
        }
        //check if the user exists
        const user = await getUserByEmail(email);
        if (!user) {
            throw createHttpError(400, 'User not found');
        }
        const deletedUser = await deleteUserByEmail(email);
        res.json({ message: 'User deleted' });
    } catch (error) {
        next(error);
    }
}