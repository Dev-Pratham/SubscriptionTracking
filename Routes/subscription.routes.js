import { Router } from "express";
import { authorize } from "../middleware/auth.middleware.js";
import {
  createSubscription,
  getSubscription,
} from "../controllers/subscription.controller.js";

const subscriptionRouter = Router();

subscriptionRouter.get("/", (req, res) => {
  res.send({ title: "Get all subscriptions" });
});

subscriptionRouter.get("/:id", (req, res) => {
  res.send({ title: "Get subscriptions by id" });
});

// subscriptionRouter.post("/", authorize, (req, res) => {
//   res.send({ title: "Create subscription" });
// });

subscriptionRouter.post("/", authorize, createSubscription);

subscriptionRouter.put("/:id", (req, res) => {
  res.send({ title: "Update Subscription" });
});

subscriptionRouter.delete("/:id", (req, res) => {
  res.send({ title: "Delete subscriptions" });
});

//get subscriptions by user id
subscriptionRouter.get("/user/:id", authorize, getSubscription);

subscriptionRouter.put("/:id/cancel", (req, res) => {
  res.send({ title: "Cancel Subscriptions" });
});

subscriptionRouter.get("/upcoming-renewals", (req, res) => {
  res.send({ title: "Get upcoming renewals" });
});
export default subscriptionRouter;
