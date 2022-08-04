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
  .get(getTournament)
  .post(createTournament)
  .delete(deleteTournament)
  .patch(updateTournament);

export default tournamentRouter;
