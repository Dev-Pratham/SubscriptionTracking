import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env";
import User from "../models/users.models";

const authorize = async (req, res, next) => {
  try {
    //we try to access user token
    let token;
    //this if ensures that the token will be there
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split("")[1];
    }

    //if we dont use return the code below if will still run but
    //we dont want that since there is no token at all
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    //this verifies and decodes a jwt token
    const decoded = jwt.verify(token, JWT_SECRET);

    //check if the user does exists
    const user = await User.findById(decoded.userId);

    //if it does we will attach user to the req that is being made
    if (!user) return res.status(401).json({ message: "unauthorized" });
    req.user = user;
    //then forward it to 2nd part of request
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized", error: error.message });
  }
};

/*
what this middleware does?
trying to find the user based on the token of the user that is 
trying to make the req and checks if that is the user that is logged in
and then attaches it to the req

so we can know who exactly is making that req

example:
someone is trying to request get user details -> authorize middleware -> verify and 
if valid then go to the next step
*/
