export interface TGameModel {
  getAllGames: (params: {
    filters: {
      page: number;
      limit: number;
      skip: number;
      genre: string;
      platform: string;
    };
  }) => Promise<any>;
  getGame: (params: { gameId: string }) => Promise<any>;
  createGame: (params: { newGame: any }) => Promise<any>;
  updateGame: (params: { gameId: string; updateData: any }) => Promise<any>;
  deleteGame: (params: { gameId: string }) => Promise<any>;
}
