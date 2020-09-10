const mongoose = require("mongoose");

const { Schema } = mongoose;

const BlogSchema = new Schema({
  title: String,
  content: String,
  imageUrl: String,
  createdAt: { type: Date, dedefault: Date.now },
  _user: { type: Schema.Types.ObjectId, ref: "User" },
});

const Blog = mongoose.model("Blog", BlogSchema);

module.exports = Blog;
