import { Request, Response } from "express";

export type TUserBody = {
  email: string;
  password: string;
};

export type TAuthIController = {
  login: (req: Request<{}, {}, TUserBody>, res: Response) => Promise<void>;
  register: (req: Request<{}, {}, TUserBody>, res: Response) => Promise<void>;
  logout: (req: Request, res: Response) => Promise<void>;
  verifyUser: (req: Request, res: Response) => Promise<void>;
};
