const requireLogin = require("../middlewares/requereLogin");

const Blog = require("../models/Blog");

module.exports = (app) => {
  app.get("/api/blogs", requireLogin, async (req, res) => {
    const blogs = await Blog.find({ _user: req.user.id });
    res.send(blogs);
  });
};
