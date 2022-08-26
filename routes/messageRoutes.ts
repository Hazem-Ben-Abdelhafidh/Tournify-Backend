import express from "express";
import { protect } from "../controllers/authController";
import { getMessages } from "../controllers/messageController";

const messageRouter = express.Router();

messageRouter.use(protect);

messageRouter.get("/", getMessages);

export default messageRouter;
