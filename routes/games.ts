import { Router } from "express";
import {
  createGameController,
  deleteGameController,
  getAllGamesController,
  getGameController,
  updateGameController,
} from "../controllers/gamesController";

export const gamesRouter = Router();

gamesRouter.get("/", getAllGamesController);
gamesRouter.post("/", createGameController);

gamesRouter.get("/:id", getGameController);
gamesRouter.patch("/:id", updateGameController);
gamesRouter.delete("/:id", deleteGameController);
