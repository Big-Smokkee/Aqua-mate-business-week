const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");
const {
  uploadAvatar,
  changePassword,
} = require("../controllers/userController");


router.post("/upload-avatar", auth, upload.single("avatar"), uploadAvatar);
router.put("/change-password", auth, changePassword);


module.exports = router;



