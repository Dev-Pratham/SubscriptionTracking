import User from "../models/users.models.js";

//fetch all users

export const getUsers = async (req, res, next) => {
  try {
    const allUsers = await User.find();

    if (!allUsers) {
      const error = new Error("No users found");
      error.status = 204;
      throw error;
    }

    res.status(200).json({
      success: true,
      message: "user fetched successfully",
      data: allUsers,
    });
  } catch (error) {
    next(error);
  }
};
