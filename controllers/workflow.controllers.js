//please checkout the workflow documentation in the onenote for more info
//function which will be responsibele for sending reminders
import { serve } from "@upstash/workflow/express";
import Subscription from "../models/subscription.models";

// serve means “wrap and expose your workflow function as an HTTP endpoint that Upstash can call and control.

//context basically contains workflow execution context like metadata state access and control methods
export const sendReminders = serve(async (context) => {
  //when we are creating a subscription we wanted to send the info about that sub and that is in our case subscription id

  const { subscriptionId } = context.requestPayload;

  const subscription = await fetchSubscription(context, subscriptionId);

  if (!subscription || subscription.status !== "Active") {
    //we will kill the workflow by simply returning here and dont send reminders
    return;
  }

  //else if it is active the renewal date is verified
  //check renewalDate is before current date i.e sub date has passed
  // if it has passed we will stop the workflow by simply returning
  const currentDate = new Date();
  const renewalDate = new Date(subscription.renewalDate);
  if (renewalDate <= currentDate) {
    console.log(
      `Renewal Date has passed for subscription ${subscription._id} Stopping workflow`,
    );
    return;
  }

  //now we will see aabout reminder loop
});

//helper function
const fetchSubscription = async (context, subscriptionId) => {
  // context.run() executes a piece of custom business logic as a workflow step.
  //basically this code is part of workflow and upstash can track it
  return await context.run(async () => {
    return await Subscription.findById(subscriptionId).populate(
      "user",
      "name email",
    );
  });
};
