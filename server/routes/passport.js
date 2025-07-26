import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
const router = express.Router();
const generateJwt = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    const token = generateJwt(req.user);

    res.redirect(`http://localhost:5173?token=${token}`);
  }
);

export default router;
