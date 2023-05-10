import { Router } from "express";
import GamesController from "../controllers/games.controller.js";
import { validGame } from "../middlewares/games.middleware.js";

const gamesRouter = Router();

gamesRouter.get('/', GamesController.getAllGames);
gamesRouter.post('/', validGame, GamesController.insertGame);

export default gamesRouter;