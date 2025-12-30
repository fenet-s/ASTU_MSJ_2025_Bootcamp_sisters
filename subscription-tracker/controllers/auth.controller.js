import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { JWT_EXPIRES_IN } from '../config/env.js';
// what is a req body?-> data sent by the client to the server in a POST request
// how to access req body?-> req.body
// what is session?-> a temporary context for a series of operations
// why use session?-> to ensure atomicity and consistency in db operations
// export const signUp = async (req, res, next) => {   
//     const session = await mongoose.startSession();
//     session.startTransaction();
//     try { 
//         const {name, email, password} = req.body;
//          const existingUser = await User.findOne({email}).session(session);
//          if(existingUser){
//             error.status = 409; // Conflict
//             throw new Error('User already exists with this email');
//          }
//          //hash password
//          const salt = await bcrypt.genSalt(10);
//          const hashedPassword = await bcrypt.hash(password, salt);  

//         const newUser = new User.create({name, email, password: hashedPassword});
//         await newUser.save().session(session);
//         const token = jwt.sign({userId: newUser._id}, process.env.JWT_SECRET, {expiresIn: JWT_EXPIRES_IN}); // Assume generateToken is a function that creates a JWT

//         await session.commitTransaction();
//         session.endSession();
//         res.status(201).json({
//             success: true,
//             message:"user created successfully",
//             data:{
//                 token,
//                 user: newUsers[0],
//             }
//         })
//     } catch (error) {
//         await session.abortTransaction();
//         session.endSession();
//         next(error);
//     } 
// }

export const signUp = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create user
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // create token
    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        token,
        user: newUser,
      },
    });

  } catch (error) {
    next(error);
  }
};

export const signIn = async (req, res, next) => {   
    try {   
    } catch (error) {
        next(error);
    }
}
export const signOut = async (req, res, next) => {   
    try {   
    } catch (error) {
        next(error);
    }
}
