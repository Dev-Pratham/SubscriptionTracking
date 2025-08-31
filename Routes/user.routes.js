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

userRouter.get("/users", getUsers);
//authorize is middleware and next passes the control to the next getUsers
userRouter.get("/:id", authorize, getUser);

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
