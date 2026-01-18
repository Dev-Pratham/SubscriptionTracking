import express from "express";
import { PORT, NODE_ENV } from "./config/env.js";
import authRouter from "./Routes/auth.routes.js";
import subscriptionRouter from "./Routes/subscription.routes.js";
import userRouter from "./Routes/user.routes.js";
import connectToDatabase from "./database/mongodb.js";
import errorMiddleware from "./middleware/error.middleware.js";
import cookieParser from "cookie-parser";
import { arcMiddleware } from "./middleware/arcjet.middleware.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//reads cookies from incoming req so app can store and use them
app.use(cookieParser());

//This specifies which routes to use for the application

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);
app.use("/api/v1/users", userRouter);
app.use(errorMiddleware);

app.get("/", arcMiddleware, async (req, res) => {
  res.send("Subscription tracking API is running...");
});

app.listen(PORT, async () => {
  //here we will connect to the database
  //as app.listen starts the server
  console.log(
    `Subscription tracking API is running on http://localhost:${PORT} ${NODE_ENV}`
  );
  await connectToDatabase();
});

export default app;
