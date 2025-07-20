import { Router } from "express";

const subscriptionRouter = Router();

subscriptionRouter.get("/", (req, res) => {
  res.send({ title: "Get all subscriptions" });
});

subscriptionRouter.get("/:id", (req, res) => {
  res.send({ title: "Get subscriptions by id" });
});

subscriptionRouter.post("/", (req, res) => {
  res.send({ title: "Create subscription" });
});

subscriptionRouter.put("/:id", (req, res) => {
  res.send({ title: "Update Subscription" });
});

subscriptionRouter.delete("/:id", (req, res) => {
  res.send({ title: "Delete subscriptions" });
});

subscriptionRouter.get("/user/:id", (req, res) => {
  res.send({ title: "Get all user subscription" });
});

subscriptionRouter.put("/:id/cancel", (req, res) => {
  res.send({ title: "Cancel Subscriptions" });
});

subscriptionRouter.get("/upcoming-renewals", (req, res) => {
  res.send({ title: "Get upcoming renewals" });
});
export default subscriptionRouter;
