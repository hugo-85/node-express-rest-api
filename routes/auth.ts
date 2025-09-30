import { Router } from "express";
import { AuthController } from "../controllers/authController";
import { TAuthModel } from "../interfaces/modelInterfaces.js";

export const createAuthRouter = ({ authModel }: { authModel: TAuthModel }) => {
  const router = Router();
  const authController = new AuthController({ model: authModel });

  router.post("/login", (req, res) => authController.login(req, res));
  router.post("/register", (req, res) => authController.register(req, res));
  router.post("/logout", (req, res) => authController.logout(req, res));
  router.get("/verify", (req, res) => authController.verifyUser(req, res));

  return router;
};
