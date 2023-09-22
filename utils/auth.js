const withAuth = (req, res, next) => {
  if (!req.session.userId) {
    res.status(400).json({message: "This request requires authentication!"});
  } else {
    next();
  }
};

module.exports = withAuth;
