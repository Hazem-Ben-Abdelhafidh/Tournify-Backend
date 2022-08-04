import dotenv from "dotenv";
dotenv.config();
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import router from "./routes/userRoutes";
import tournamentRouter from "./routes/tournamentsRoutes";
import AppError from "./utils/appError";
import helmet from "helmet";
process.on("uncaughtException", (err) => {
  console.log(err.name);
  console.log(err.message);
  console.log("shutting down...");
  process.exit(1);
});

const app = express();
const port = 5000;
app.use(express.json());
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(helmet());
app.listen(port, () => {
  console.log("Application listening on port: ", port);
});
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`can't find ${req.originalUrl} on this server`, 404));
});

app.use("/users", router);
app.use("/tournaments", tournamentRouter);
process.on("unhandledRejection", (err: any) => {
  console.log(err.name);
  console.log(err.message);
  console.log("shutting down...");
  server.close(() => {
    process.exit(1);
  });
});
