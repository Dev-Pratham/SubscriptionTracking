import { Router } from "express";

const workflowRouter = Router();

//we have to replace this with actual workflow logic later
workflowRouter.get("/", (req, res) => {
  res.send("Workflow route is working");
});

export default workflowRouter;
