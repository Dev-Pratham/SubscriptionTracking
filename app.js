import express from "express";
import { PORT, NODE_ENV } from "./config/env.js";
import authRouter from "./Routes/auth.routes.js";
import subscriptionRouter from "./Routes/subscription.routes.js";
import userRouter from "./Routes/user.routes.js";
import connectToDatabase from "./database/mongodb.js";

const app = express();

//This specifies which routes to use for the application

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);
app.use("/api/v1/users", userRouter);

app.get("/", (req, res) => {
  res.send("Welcome to Subscription tracking Api");
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
