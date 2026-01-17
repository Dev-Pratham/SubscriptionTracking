import express from "express";
import { PORT, NODE_ENV } from "./config/env.js";
import authRouter from "./Routes/auth.routes.js";
import subscriptionRouter from "./Routes/subscription.routes.js";
import userRouter from "./Routes/user.routes.js";
import connectToDatabase from "./database/mongodb.js";
import errorMiddleware from "./middleware/error.middleware.js";
import cookieParser from "cookie-parser";
import arcjet, { shield, detectBot, tokenBucket } from "@arcjet/node";
import { isSpoofedBot } from "@arcjet/inspect";

const app = express();

const aj = arcjet({
  // Get your site key from https://app.arcjet.com and set it as an environment
  // variable rather than hard coding.
  key: process.env.ARCJET_KEY,
  rules: [
    // Shield protects your app from common attacks e.g. SQL injection
    shield({ mode: "LIVE" }),
    // Create a bot detection rule
    detectBot({
      mode: "LIVE", // Blocks requests. Use "DRY_RUN" to log only
      // Block all bots except the following
      allow: [
        "CATEGORY:SEARCH_ENGINE", // Google, Bing, etc
        // Uncomment to allow these other common bot categories
        // See the full list at https://arcjet.com/bot-list
        //"CATEGORY:MONITOR", // Uptime monitoring services
        //"CATEGORY:PREVIEW", // Link previews e.g. Slack, Discord
      ],
    }),
    // Create a token bucket rate limit. Other algorithms are supported.
    tokenBucket({
      mode: "LIVE",
      // Tracked by IP address by default, but this can be customized
      // See https://docs.arcjet.com/fingerprints
      //characteristics: ["ip.src"],
      refillRate: 5, // Refill 5 tokens per interval
      interval: 10, // Refill every 10 seconds
      capacity: 10, // Bucket capacity of 10 tokens
    }),
  ],
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//reads cookies from incoming req so app can store and use them
app.use(cookieParser());

//This specifies which routes to use for the application

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);
app.use("/api/v1/users", userRouter);
app.use(errorMiddleware);

app.get("/", async (req, res) => {
  const decision = await aj.protect(req, { requested: 5 }); // Deduct 5 tokens from the bucket
  console.log("Arcjet decision", decision);

  if (decision.isDenied()) {
    if (decision.reason.isRateLimit()) {
      res.writeHead(429, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Too Many Requests" }));
    } else if (decision.reason.isBot()) {
      res.writeHead(403, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "No bots allowed" }));
    } else {
      res.writeHead(403, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Forbidden" }));
    }
  } else if (decision.ip.isHosting()) {
    // Requests from hosting IPs are likely from bots, so they can usually be
    // blocked. However, consider your use case - if this is an API endpoint
    // then hosting IPs might be legitimate.
    // https://docs.arcjet.com/blueprints/vpn-proxy-detection
    res.writeHead(403, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Forbidden" }));
  } else if (decision.results.some(isSpoofedBot)) {
    // Paid Arcjet accounts include additional verification checks using IP data.
    // Verification isn't always possible, so we recommend checking the decision
    // separately.
    // https://docs.arcjet.com/bot-protection/reference#bot-verification
    res.writeHead(403, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Forbidden" }));
  } else {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({ message: "Welcome to subscription tracking API" })
    );
  }
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
