import User from "../models/users.models.js";

//fetch all users
//authorization
//now we have to make regular user to prevent this call
//This can be done using middleware for authorization

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

//This one is most probably to get users by id
export const getUser = async (req, res, next) => {
  try {
    //the question is what do i need to pass in req body?

    //here password is a field in the database
    //req.params contains the data we pass in the req url
    //select is a projection for what to include and exclude in the result

    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      const error = new Error("No user for this id exists");
      error.code = 204;
      throw new error();
    }

    res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
