import { Router } from "express";
import { signIn, signUp } from "../controllers/auth.controllers.js";

const authRouter = Router();

//we created sepereated routes as sign up function can be complex
//and code becomes clutter
// authRouter.get("/", (req, res) => {
//   res.send({ title: "Sign Up Route" });
// });

// authRouter.post("/", (req, res) => {
//   res.send({ title: "Sign In Route" });
// });

// authRouter.post("/", (req, res) => {
//   res.send({ title: "Sign Out Route" });
// });

//Path /api/v1/auth/sign-up (POST)
authRouter.post("/sign-up", signUp);
authRouter.post("/sign-in", signIn);
authRouter.post("/sign-out", (req, res) => {
  res.send({ title: "Sign Out Route" });
});

export default authRouter;
