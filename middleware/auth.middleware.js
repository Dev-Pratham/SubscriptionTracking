const authorize = async (req, res, next) => {
  try {
    //we try to access user token
    let token;
    //this if ensures that the token will be there
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split("")[1];
    }

    //if we dont use return the code below if will still run but
    //we dont want that since there is no token at all
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  } catch (error) {
    res.status(401).json({ message: "Unauthorized", error: error.message });
  }
};
