import { config } from "dotenv";
//setting up the env file
config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });

//destructuring process.env to get the variables
export const {
  PORT,
  NODE_ENV,
  DB_URL,
  JWT_SECRET,
  JWT_EXPIRES_IN,
  ARCJET_ENV,
  ARCJET_KEY,
} = process.env;
