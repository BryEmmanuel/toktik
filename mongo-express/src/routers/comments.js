const express = require("express");
const router = express.Router();

const { authUser } = require("../middleware/auth.js");

const {
  addReplies,
  addComments,
  deleteComments,
  deleteReply,
} = require("../controllers/videos.js");

router.post("/replies/:id", authUser, addReplies);
router.put("/:id", authUser, addComments);
router.delete("/:id", authUser, deleteReply);
router.patch("/delete/:id", authUser, deleteComments);

module.exports = router;
