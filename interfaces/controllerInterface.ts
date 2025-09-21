import { Request, Response } from "express";

export type AllGamesQueryParams = {
  page?: string;
  limit?: string;
  skip?: string;
  genre?: string;
  platform?: string;
};

export type GetGameParams = {
  id: string;
};

export type CreateGameBody = {
  name: string;
  released: string;
  background_image: string;
  rating: number;
  ratings_count: number;
  platforms: string[];
  genres: string[];
};

export type UpdateGameParams = {
  id: string;
};

export type UpdateGameBody = Partial<{
  name: string;
  released: string;
  background_image: string;
  rating: number;
  ratings_count: number;
  platforms: string[];
  genres: string[];
}>;

export type DeleteGameParams = {
  id: string;
};

export type IController = {
  getAllGamesController: (
    req: Request<{}, {}, {}, AllGamesQueryParams>,
    res: Response
  ) => Promise<void>;
  getGameController: (
    req: Request<GetGameParams>,
    res: Response
  ) => Promise<void>;
  createGameController: (
    req: Request<{}, {}, CreateGameBody>,
    res: Response
  ) => Promise<void>;
  updateGameController: (
    req: Request<UpdateGameParams, {}, UpdateGameBody>,
    res: Response
  ) => Promise<void>;
  deleteGameController: (
    req: Request<DeleteGameParams>,
    res: Response
  ) => Promise<void>;
};
