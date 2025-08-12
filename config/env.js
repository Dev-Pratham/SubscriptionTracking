// import { config } from "dotenv";
import { config } from "dotenv";

config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });

//destructuring process.env to get the variables
export const { PORT, NODE_ENV, DB_URL } = process.env;
