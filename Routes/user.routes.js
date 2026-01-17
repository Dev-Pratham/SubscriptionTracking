import { Router } from "express";
import { getUser, getUsers } from "../controllers/user.controllers.js";
import { authorize } from "../middleware/auth.middleware.js";
const userRouter = Router();
//This defines the basic routes for users
/*

userRouter.get("/get-users", (req, res) => {
  res.send({ title: "Get all users" });
});
userRouter.get("/:id", (req, res) => {
  res.send({ title: "Get users details" });
});
userRouter.post("/", (req, res) => {
  res.send({ title: "Create new users" });
});
userRouter.put("/:id", (req, res) => {
  res.send({ title: "Update user" });
});

userRouter.delete("/:id", (req, res) => {
  res.send({ title: "Delete user" });
});

*/

userRouter.get("/", getUsers);
//authorize is middleware and next passes the control to the next getUsers
userRouter.get("/:id", authorize, getUser);
//we can also make stricter rule so that only admins can access users
//by creating middleware that checks whether admin is true or other methods
userRouter.post("/", (req, res) => {
  res.send({ title: "Create new users" });
});
userRouter.put("/:id", (req, res) => {
  res.send({ title: "Update user" });
});

userRouter.delete("/:id", (req, res) => {
  res.send({ title: "Delete user" });
});

export default userRouter;
