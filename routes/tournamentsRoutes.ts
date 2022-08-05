import express from "express";
import { protect } from "../controllers/authController";
import {
  createTournament,
  deleteTournament,
  getTournament,
  updateTournament,
} from "../controllers/tournamentController";
const tournamentRouter = express.Router();
tournamentRouter.use(protect);
tournamentRouter
  .route("/")
  .post(createTournament)
  .delete(deleteTournament)
  .patch(updateTournament);
tournamentRouter.route("/:id").get(getTournament);

export default tournamentRouter;
