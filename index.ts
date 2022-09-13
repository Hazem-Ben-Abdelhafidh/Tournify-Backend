import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import bodyParser from "body-parser";
import router from "./routes/userRoutes";
import tournamentRouter from "./routes/tournamentsRoutes";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { google } from "googleapis";
import messageRouter from "./routes/messageRoutes";
import conversationRouter from "./routes/conversationRoutes";
import { messageHandler } from "./controllers/messageController";
import redisClient from "./redis";
process.on("uncaughtException", (err) => {
  console.log(err.name);
  console.log(err.message);
  console.log("shutting down...");
  process.exit(1);
});
const scopes = ["https://www.googleapis.com/auth/drive"];

const app = express();
const port = 5000;
app.use(express.json());
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://127.0.0.1:5173"); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
const corsOptions = {
  origin: "http://127.0.0.1:5173",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(helmet());
const server = app.listen(port, () => {
  const auth = new google.auth.GoogleAuth({
    keyFile: process.env.KEY_FILE_PATH!,
    scopes,
  });
  const driveService = google.drive({
    version: "v3",
    auth,
  });
  console.log("Application listening on port: ", port);
  redisClient();
});
app.use(cookieParser());

export const io = new Server(server, {
  cors: {
    origin: "http://127.0.0.1:5173",
    methods: ["GET", "POST", "DELETE", "PATCH", "PUT"],
  },
});

io.on("connection", (socket) => {
  messageHandler(io, socket);
});
app.use("/users", router);
app.use("/tournaments", tournamentRouter);
app.use("/messages", messageRouter);
app.use("/conversations", conversationRouter);
