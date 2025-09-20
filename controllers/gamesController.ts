import { Request, Response } from "express";
import {
  createGame,
  deleteGame,
  getAllGames,
  getGame,
  updateGame,
} from "../models/game";
import { validateGame, validateParcialGame } from "../schemas/games";

type AllGamesQueryParams = {
  page?: string;
  limit?: string;
  skip?: string;
  genre?: string;
  platform?: string;
};

export const getAllGamesController = async (
  req: Request<{}, {}, {}, AllGamesQueryParams>,
  res: Response
) => {
  try {
    // Pagination parameters
    const page = parseInt(req.query?.page || "1");
    const limit = parseInt(req.query?.limit || "10");
    const skip = (page - 1) * limit;
    const genre = (req.query?.genre as string)?.toUpperCase();
    const platform = (req.query?.platform as string)?.toUpperCase();

    res.json(
      await getAllGames({ filters: { page, limit, skip, genre, platform } })
    );
  } catch (error) {
    res.status(500).json({
      message: "❌ Error fetching games",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

type GetGameParams = {
  id: string;
};

export const getGameController = async (
  req: Request<GetGameParams>,
  res: Response
) => {
  try {
    const gameId = req.params.id;
    if (!gameId) {
      return res.status(400).json({
        message: "❌ Invalid game ID",
      });
    }

    const gameResponse = await getGame({ gameId });
    if (gameResponse.status !== 200) {
      return res.status(gameResponse.status).json({
        message: gameResponse.message,
      });
    }

    const game = gameResponse.game;

    res.json(game);
  } catch (error) {
    res.status(500).json({
      message: "❌ Error fetching game",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

type CreateGameBody = {
  name: string;
  released: string;
  background_image: string;
  rating: number;
  ratings_count: number;
  platforms: string[];
  genres: string[];
};

export const createGameController = async (
  req: Request<{}, {}, CreateGameBody>,
  res: Response
) => {
  try {
    const newGame = req.body;

    // Validate the new game data
    const validation = validateGame(newGame);

    if (!validation.success) {
      return res.status(400).json({
        message: "❌ Invalid game data",
        errors: JSON.parse(validation.error?.message || "{}"),
      });
    }

    const newGameResp = await createGame({ newGame: validation.data });

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
};

type UpdateGameParams = {
  id: string;
};

type UpdateGameBody = Partial<{
  name: string;
  released: string;
  background_image: string;
  rating: number;
  ratings_count: number;
  platforms: string[];
  genres: string[];
}>;

export const updateGameController = async (
  req: Request<UpdateGameParams, {}, UpdateGameBody>,
  res: Response
) => {
  try {
    const gameId = req.params.id;
    const updateData = req.body;

    if (!gameId) {
      return res.status(400).json({
        message: "❌ Invalid game ID",
      });
    }

    // Validate the update data
    const validation = validateParcialGame(updateData);

    if (!validation.success) {
      return res.status(400).json({
        message: "❌ Invalid game data",
        errors: JSON.parse(validation.error?.message || "{}"),
      });
    }

    const updateGameResult = await updateGame({
      gameId,
      updateData: validation.data,
    });
    if (updateGameResult.status !== 200) {
      return res.status(updateGameResult.status).json({
        message: updateGameResult.message,
      });
    }

    res.json(updateGameResult.game);
  } catch (error) {
    res.status(500).json({
      message: "❌ Error updating game",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

type DeleteGameParams = {
  id: string;
};

export const deleteGameController = async (
  req: Request<DeleteGameParams>,
  res: Response
) => {
  try {
    const gameId = req.params.id;
    if (!gameId) {
      return res.status(400).json({
        message: "❌ Invalid game ID",
      });
    }

    // Call the deleteGame function from the model
    const deleteGameResult = await deleteGame({ gameId });
    if (deleteGameResult.status !== 200) {
      return res.status(deleteGameResult.status).json({
        message: deleteGameResult.message,
      });
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
};
