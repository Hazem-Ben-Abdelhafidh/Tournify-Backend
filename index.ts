import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import router from "./routes/userRoutes";

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

app.listen(port, () => {
  console.log("Application listening on port: ", port);
});
app.use("/users", router);
