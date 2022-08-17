import express from "express";
import { protect } from "../controllers/authController";
import {
  createTournament,
  deleteTournament,
  getTournament,
  getTournaments,
  searchResults,
  updateTournament,
  joinTournament,
  getParticipants,
} from "../controllers/tournamentController";
const tournamentRouter = express.Router();
tournamentRouter.use(protect);
tournamentRouter.route("/").get(getTournaments).post(createTournament);
tournamentRouter.get("/search", searchResults);
tournamentRouter.post("/join/:id", joinTournament);
tournamentRouter.get("/participants/:id", getParticipants);
tournamentRouter
  .route("/:id")
  .get(getTournament)
  .delete(deleteTournament)
  .patch(updateTournament);

export default tournamentRouter;
