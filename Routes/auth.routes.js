import { Router } from "express";

const authRouter = Router();

authRouter.get("/", (req, res) => {
  res.send({ title: "Sign Up Route" });
});

authRouter.post("/", (req, res) => {
  res.send({ title: "Sign In Route" });
});

authRouter.post("/", (req, res) => {
  res.send({ title: "Sign Out Route" });
});

export default authRouter;
