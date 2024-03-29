import express from "express";
import {
  createTournament,
  deleteTournament,
  getTournament,
  getTournaments,
  searchResults,
  updateTournament,
  joinTournament,
  getParticipants,
  getTournamentsById,
} from "../controllers/tournamentController";
import { protect } from "../middlewares/protect";
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
tournamentRouter.get("/users/:id", getTournamentsById);

export default tournamentRouter;
