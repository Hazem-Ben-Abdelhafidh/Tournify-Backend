import express from "express";
import { protect } from "../controllers/authController";
import {
  getConversation,
  getConversations,
} from "../controllers/conversationController";

const conversationRouter = express.Router();

conversationRouter.use(protect);

conversationRouter.get("/", getConversations);
conversationRouter.get("/:id", getConversation);

export default conversationRouter;
