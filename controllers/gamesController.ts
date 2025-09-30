import { Request, Response } from "express";
import { validateGame, validateParcialGame } from "../schemas/games.js";
import {
  AllGamesQueryParams,
  CreateGameBody,
  DeleteGameParams,
  GetGameParams,
  IController,
  UpdateGameBody,
  UpdateGameParams,
} from "../interfaces/controllerInterface.js";
import { TGameModel } from "../interfaces/modelInterfaces.js";

export class GameController implements IController {
  //implements IController
  private model: TGameModel;

  constructor({ model }: { model: TGameModel }) {
    this.model = model;
  }

  async getAllGamesController(
    req: Request<{}, {}, {}, AllGamesQueryParams>,
    res: Response
  ) {
    try {
      // Pagination parameters
      const page = parseInt(req.query?.page || "1");
      const limit = parseInt(req.query?.limit || "10");
      const skip = (page - 1) * limit;
      const genre = (req.query?.genre as string)?.toUpperCase();
      const platform = (req.query?.platform as string)?.toUpperCase();
      const data = await this.model.getAllGames({
        filters: { page, limit, skip, genre, platform },
      });
      res.json(data);
    } catch (error) {
      res.status(500).json({
        message: "❌ Error fetching games",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async getGameController(req: Request<GetGameParams>, res: Response) {
    try {
      const gameId = req.params.id;
      if (!gameId) {
        res.status(400).json({
          message: "❌ Invalid game ID",
        });

        return;
      }

      const gameResponse = await this.model.getGame({ gameId });
      if (gameResponse.status !== 200) {
        res.status(gameResponse.status).json({
          message: gameResponse.message,
        });
        return;
      }

      const game = gameResponse.game;

      res.json(game);
    } catch (error) {
      res.status(500).json({
        message: "❌ Error fetching game",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async createGameController(
    req: Request<{}, {}, CreateGameBody>,
    res: Response
  ) {
    try {
      const newGame = req.body;

      // Validate the new game data
      const validation = validateGame(newGame);

      if (!validation.success) {
        res.status(400).json({
          message: "❌ Invalid game data",
          errors: JSON.parse(validation.error?.message || "{}"),
        });
        return;
      }

      const newGameResp = await this.model.createGame({
        newGame: validation.data,
      });

      res.status(newGameResp.status).json({
        message: newGameResp.message,
        game: newGameResp.game,
      });
    } catch (error) {
      res.status(500).json({
        message: "❌ Error adding new game",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async updateGameController(
    req: Request<UpdateGameParams, {}, UpdateGameBody>,
    res: Response
  ) {
    try {
      const gameId = req.params.id;
      const updateData = req.body;

      if (!gameId) {
        res.status(400).json({
          message: "❌ Invalid game ID",
        });
        return;
      }

      // Validate the update data
      const validation = validateParcialGame(updateData);

      if (!validation.success) {
        res.status(400).json({
          message: "❌ Invalid game data",
          errors: JSON.parse(validation.error?.message || "{}"),
        });
        return;
      }

      const updateGameResult = await this.model.updateGame({
        gameId,
        updateData: validation.data,
      });
      if (updateGameResult.status !== 200) {
        res.status(updateGameResult.status).json({
          message: updateGameResult.message,
        });
        return;
      }

      res.json(updateGameResult.game);
    } catch (error) {
      res.status(500).json({
        message: "❌ Error updating game",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async deleteGameController(req: Request<DeleteGameParams>, res: Response) {
    try {
      const gameId = req.params.id;
      if (!gameId) {
        res.status(400).json({
          message: "❌ Invalid game ID",
        });
        return;
      }

      // Call the deleteGame function from the model
      const deleteGameResult = await this.model.deleteGame({ gameId });
      if (deleteGameResult.status !== 200) {
        res.status(deleteGameResult.status).json({
          message: deleteGameResult.message,
        });
        return;
      }

      res.json({
        message: "✅ Game deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        message: "❌ Error deleting game",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}
