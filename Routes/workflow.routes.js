import { Router } from "express";
import { sendReminders } from "../controllers/workflow.controllers.js";

const workflowRouter = Router();

//we have to replace this with actual workflow logic later
workflowRouter.post("/send-reminders", sendReminders);

export default workflowRouter;
