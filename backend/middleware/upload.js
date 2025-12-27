const multer = require("multer");
const path = require("path");


const storage = multer.diskStorage({
  destination: "uploads/avatars",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});


const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    if (ext) cb(null, true);
    else cb(new Error("Only images allowed"));
  },
});


module.exports = upload;



