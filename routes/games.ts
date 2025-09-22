import { Router } from "express";
import { GameController } from "../controllers/gamesController.js";
import { TGameModel } from "../interfaces/modelInterfaces.js";

export const createGameRouter = ({ gameModel }: { gameModel: TGameModel }) => {
  // Create the controller instance with the injected model
  const gameController = new GameController({ model: gameModel });

  const gamesRouter = Router();

  // IMPORTANT: Use .bind() to preserve 'this' context
  gamesRouter.get(
    "/",
    gameController.getAllGamesController.bind(gameController)
  );
  gamesRouter.post(
    "/",
    gameController.createGameController.bind(gameController)
  );

  gamesRouter.get(
    "/:id",
    gameController.getGameController.bind(gameController)
  );
  gamesRouter.patch(
    "/:id",
    gameController.updateGameController.bind(gameController)
  );
  gamesRouter.delete(
    "/:id",
    gameController.deleteGameController.bind(gameController)
  );

  return gamesRouter;
};
