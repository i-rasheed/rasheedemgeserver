const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  text: { type: String, required: true },
  userId: {type: String, required: true}
});

module.exports = Blog = mongoose.model("blog", blogSchema);
