import express from "express";
import { getMessages } from "../controllers/messageController";
import { protect } from "../middlewares/protect";

const messageRouter = express.Router();

messageRouter.use(protect);

messageRouter.get("/:id", getMessages);

export default messageRouter;
