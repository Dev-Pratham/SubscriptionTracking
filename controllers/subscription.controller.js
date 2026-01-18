import Subscription from "../models/subscription.models.js";
export const createSubscription = async (req, res, next) => {
  try {
    const subscriptionData = {
      ...req.body,
      //this req user is not part of req body as it is set by the auth middleware
      user: req.user._id,
    };

    const newSubscription = await Subscription.create(subscriptionData);
    res.status(201).json({ success: true, data: newSubscription });
  } catch (error) {
    next(error);
  }
};
