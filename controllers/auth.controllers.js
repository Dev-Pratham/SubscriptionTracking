//here we will implement signup logic
//controller forms the logic of the specific routes
import mongoose from "mongoose";
import User from "../models/users.models.js";
import jwt from "jsonwebtoken";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/env.js";
import bcrypt from "bcryptjs";
import { token, id } from "../config/env.js";
export const signUp = async (req, res, next) => {
  //Nothing to so with user transaction its a database session for
  //ensuring atomic operations(either all or nothing)
  const session = await mongoose.startSession();
  session.startTransaction();

  //req body is an object  containing data from the client post request
  try {
    // logic to create new user
    //destructuring from req body
    const { name, email, password } = req.body;

    //check if a user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error("User already exists");
      error.statusCode = 409;
      throw error;
    }

    //gensalt adds random string added to the password
    //bcrypt hash and generates passwords
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    //now we can finally create single user

    //remember something can go wrong so we need to attach session so that the
    //transaction can be aborted and user will not be created
    const newUser = await User.create(
      [{ name, email, password: hashPassword }],
      { session }
    );

    //generate token so that user can sign in
    //the sign will take an object of userId its an object of the sign method
    //itsef where we need to set the userid of the created user

    //2nd param jwtsecret
    const token = jwt.sign({ userId: newUser[0]._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    //if user does not exists we can hash the password and create new user
    //as we never wanna store pass in plain text
    await session.commitTransaction();
    session.endSession();
    res.status(201).json({
      success: true,
      message: "User Created Successfully",
      data: {
        token,
        user: newUser[0],
      },
    });
  } catch (error) {
    //if something goes wrong dnot do anything abort db transaction
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

export const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = User.findOne({ email });

    if (!user) {
      const error = new Error("user does not exist");
      error.statusCode = 404;
      throw error;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      const error = new Error("password Invalid");
      error.statusCode = 401;
      throw error;
    }
  } catch (error) {
    next(error);
  }
};
export const signOut = async (req, res, next) => {};
