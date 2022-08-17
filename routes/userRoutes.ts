import express from "express";
import { signup, login, protect } from "../controllers/authController";
import { getUser } from "../controllers/userController";
const router = express.Router();
router.post("/signup", signup);
router.post("/login", login);
router.get("/getUser/:id", protect, getUser);
export default router;
