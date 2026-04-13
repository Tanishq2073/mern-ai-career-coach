const express = require("express");
const router = express.Router();


const { registerUser,loginUser,updateUserProfile } = require("../controllers/userController");

router.post("/login", loginUser);

// POST route
router.post("/register", registerUser);


const protect = require("../middleware/authmiddleware");

router.get("/profile", protect, (req, res) => {
  res.json(req.user);
});
router.put("/profile", protect, updateUserProfile);

module.exports = router;