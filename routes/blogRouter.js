const router = require("express").Router();
const auth = require("../middleware/auth");
const Blog = require("../models/blogModel");

// post blog
router.post("/", auth, async (req, res) => {
    try {
      const { title, text } = req.body;
  
      // validate
  
      if (!title || !text)
        return res.status(400).json({ msg: "Not all fields have been entered." });

        const newBlog = new Blog({
            title,
            text,
            userId: req.user
        })
            const savedBlog = await newBlog.save()
            res.json(savedBlog)
          } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

// get all blogs for a given user
  router.get("/all", auth, async (req, res) => {
    try {
        const blogs = await Blog.find({userId: req.user})
        res.json(blogs)
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.delete("/:id", auth, async (req, res) => {
    try {
        const blog = await Blog.findOne({userId: req.user, _id: req.params.id})
        if(!blog)
        return res.status(400).json({ msg: "No blog found with this id that belongs to the current user." });
        const deletedBlog = await Blog.findByIdAndDelete(req.params.id)
        res.json(deletedBlog)
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });



  module.exports = router;
