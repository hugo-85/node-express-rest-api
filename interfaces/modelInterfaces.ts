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

export interface TAuthModel {
  loginWithEmail: ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => Promise<{ ok: boolean; user?: any; message?: string }>;
  createUser: ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => Promise<{ created: boolean; id?: string; message?: string }>;
}
