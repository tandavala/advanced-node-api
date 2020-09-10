const requireLogin = require("../middlewares/requereLogin");

const Blog = require("../models/Blog");

module.exports = (app) => {
  app.get("/api/blogs", requireLogin, async (req, res) => {
    const blogs = await Blog.find({ _user: req.user.id });

    console.log(req.user);
    res.send(blogs);
  });

  app.get("/api/blogs/:id", requireLogin, async (req, res) => {
    const blog = await Blog.findOne({ _user: req.user.id, _id: req.params.id });

    if (!blog) {
      return res.status(400).json({ mesg: "this blog post does not exist" });
    }

    res.send(blog);
  });

  app.post("/api/blogs", requireLogin, async (req, res) => {
    const { title, content } = req.body;

    if (!title && !content) {
      res.status(400).json({ msg: "must provide title and content" });
    }

    const blog = new Blog({
      title,
      content,
      _user: req.user.id,
    });

    try {
      await blog.save();

      res.send(blog);
    } catch (error) {
      res.send(400, err);
    }
  });
};
