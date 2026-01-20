import Subscription from "../models/subscription.models.js";
import client from "../config/upstash.js";
import { BACKEND_URL } from "../config/env.js";
//create subscription
export const createSubscription = async (req, res, next) => {
  try {
    //This is preferred but not needed as of now
    // Only allow these fields from the user
    // const { name, amount, renewalDate } = req.body;

    // const subscriptionData = {
    //   name,
    //   amount,
    //   renewalDate,
    //   user: req.user._id,   // ownership always set by backend
    //   status: "Active",     // default status
    // };

    const subscriptionData = {
      ...req.body,
      //this req user is not part of req body as it is set by the auth middleware
      user: req.user._id,
    };

    const newSubscription = await Subscription.create(subscriptionData);

    //we will call the workflow right after creating the subscription
    const { workflowRunId } = await client.trigger({
      url: `${BACKEND_URL}/api/v1/workflows/send-reminders`,
      body: { subscriptionId: newSubscription._id },
    });

    res
      .status(201)
      .json({ success: true, data: newSubscription, workflowRunId });
  } catch (error) {
    next(error);
  }
};

//get all subscriptions of the system -admin only
export const getSubscriptions = async (req, res, next) => {
  try {
    const subscriptions = await Subscription.find();
    if (!subscriptions) {
      return res
        .status(404)
        .json({ success: false, message: "No subscription found" });
    }
    res.status(200).json({ success: true, data: subscriptions });
  } catch (error) {
    next(error);
  }
};

//get subscriptions by user yeah this should be authorized
export const getSubscription = async (req, res, next) => {
  try {
    if (req.user._id !== req.params._id) {
      //here we are not sending res saying you are not owner because this causes some info
      //to leak like resource exists , id is valid, someone else owns it etc
      const error = new Error();
      error.status = 401;
      error.message = "Unauthorized access to subscriptions";
      throw error;
    }
    const subscription = await Subscription.find({ user: req.user._id });
    if (!subscription || subscription.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No subscription found for this id" });
    }
    res.status(200).json({ success: true, data: subscription });
  } catch (error) {
    next(error);
  }
};

export const getSubscriptionById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const subscriptions = await Subscription.findById(id);
    if (!subscriptions) {
      return res
        .status(404)
        .json({ success: false, message: "No subscription for this id" });
    }

    res.status(200).json({ success: true, data: subscriptions });
  } catch (error) {
    next(error);
  }
};

export const updateSubscriptionById = async (req, res, next) => {
  const { id } = req.params;
  try {
    //checkout findone and update mongoose doc in geeksforgeeks
    const updateSubscription = await Subscription.findOneAndUpdate(
      //ownership check
      { _id: id, user: req.user._id },
      //this req body contains mass assignment vulnerability so wishlisting some fields which can only be updated
      //   req.body
      {
        name: req.body.name,
        amount: req.body.amount,
        renewalDate: req.body.renewalDate,
      },
      { new: true, runValidators: true },
    );

    if (!updateSubscription) {
      return res
        .status(404)
        .json({ success: false, message: "No subscription for this id found" });
    }
    res.status(200).json({ success: true, data: updateSubscription });
  } catch (error) {
    next(error);
  }
};

export const deleteSubscriptionById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedSubscription = await Subscription.findOneAndDelete({
      _id: id,
      user: req.user._id, //ownership check
    });
    if (!deletedSubscription) {
      return res
        .status(404)
        .json({ success: false, message: "No subscription for this id found" });
    }
    res.status(200).json({
      success: true,
      data: deletedSubscription,
      message: "Subscription deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const cancelSubscription = async (req, res, next) => {
  try {
    const { id } = req.params;
    const canceledSubscription = await Subscription.findOneAndUpdate(
      //this ensure u are not cancelling already cancelled subscription
      { _id: id, user: req.user._id, status: { $ne: "Cancelled" } }, //ownership check
      { status: "Cancelled" },
      { new: true },
      //by default mongoose does not run validators on update operations
    );

    if (cancelSubscription.status === "Cancelled") {
      return res
        .status(400)
        .json({ success: false, message: "Subscription is already cancelled" });
    }

    if (!canceledSubscription) {
      return res
        .status(404)
        .json({ success: false, message: "No subscription found for this id" });
    }
    res.status(200).json({ success: true, data: canceledSubscription });
  } catch (error) {
    next(error);
  }
};

export const upcomingRenewals = async (req, res, next) => {
  //new date works on utc to server must be utc time zone
  //and also the frontend should send date in utc format
  try {
    const today = new Date();
    const upcomingWeek = new Date();
    upcomingWeek.setDate(today.getDate() + 14); //getDate returns day of month

    const renewals = await Subscription.find({
      status: "Active",
      renewalDate: { $gte: today, $lte: upcomingWeek },
    });

    res.status(200).json({
      success: true,
      data: renewals,
      message:
        renewals.length === 0
          ? "No upcoming renewals in next 14 days"
          : "Upcoming renewals fetched successfully",
    });
  } catch (error) {
    next(error);
  }
};
