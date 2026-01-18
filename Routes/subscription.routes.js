import { Router } from "express";
import { authorize } from "../middleware/auth.middleware.js";
import {
  createSubscription,
  deleteSubscriptionById,
  getSubscription,
  getSubscriptionById,
  getSubscriptions,
  updateSubscriptionById,
} from "../controllers/subscription.controller.js";

const subscriptionRouter = Router();
//get all subscriptions -admins only system level
subscriptionRouter.get("/", getSubscriptions);
//get subscription by id
subscriptionRouter.get("/:id", authorize, getSubscriptionById);

// subscriptionRouter.post("/", authorize, (req, res) => {
//   res.send({ title: "Create subscription" });
// });

//create subscription for logged in user
subscriptionRouter.post("/", authorize, createSubscription);

//update subscription by id
subscriptionRouter.put("/:id", authorize, updateSubscriptionById);

//delete subscription by id
subscriptionRouter.delete("/:id", authorize, deleteSubscriptionById);

//get subscriptions by user id
subscriptionRouter.get("/user/:id", authorize, getSubscription);

subscriptionRouter.put("/:id/cancel", authorize, deleteSubscriptionById);

subscriptionRouter.get("/upcoming-renewals", (req, res) => {
  res.send({ title: "Get upcoming renewals" });
});

export default subscriptionRouter;

//for future pop dev
// what authorize does is it checks if the user is logged in by verifying the token
// if the token is valid it allows the user to access the route otherwise it throws an error
// and it also attaches the user object to the req object so that we can use it in the controller
