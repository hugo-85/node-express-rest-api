import { Request, Response } from "express";
import { TAuthIController, TUserBody } from "../interfaces/authInterface.js";
import { validateAuth } from "../schemas/auth.js";
import { TAuthModel } from "../interfaces/modelInterfaces.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET_KEY } from "../configs/config.js";
import { verifyToken } from "../lib/jwt.js";

export class AuthController implements TAuthIController {
  private model: TAuthModel;

  constructor({ model }: { model: TAuthModel }) {
    this.model = model;
  }

  async login(req: Request<{}, {}, TUserBody>, res: Response) {
    try {
      const { email, password } = req.body;

      //validate auth data
      const validation = validateAuth(req.body);

      if (!validation.success) {
        res.status(400).json({
          message: "❌ Invalid user data",
          errors: JSON.parse(validation.error?.message || "{}"),
        });
        return;
      }

      const respLogin = await this.model.loginWithEmail({ email, password });

      if (respLogin.ok === false) {
        res.status(401).json({
          message: respLogin.message || "❌ Login failed",
        });
        return;
      }

      const token = jwt.sign(
        { email: respLogin.user.email },
        JWT_SECRET_KEY as string,
        {
          expiresIn: "1h",
        }
      );

      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
          //   secure: process.env.NODE_ENV === "production", this can be enabled if you have https
          sameSite: "lax",
          maxAge: 3600000, // 1 hour
        })
        .json({ user: respLogin.user });
    } catch (error) {
      res.status(500).json({
        message: "❌ Error logging in",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async register(req: Request<{}, {}, TUserBody>, res: Response) {
    try {
      const { email, password } = req.body;

      //validate auth data
      const validation = validateAuth(req.body);

      if (!validation.success) {
        res.status(400).json({
          message: "❌ Invalid user data",
          errors: JSON.parse(validation.error?.message || "{}"),
        });
        return;
      }
      const respNewUser = await this.model.createUser({ email, password });

      if (!respNewUser.created) {
        res.status(500).json({
          message: respNewUser.message || "❌ Error creating user",
        });
        return;
      }

      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      res.status(500).json({
        message: "❌ Error registering user",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async logout({}, res: Response) {
    res
      .clearCookie("access_token")
      .status(200)
      .json({ message: "User logged out successfully" });
  }

  async verifyUser(req: Request, res: Response) {
    const access_token = req.cookies?.access_token;

    if (!access_token) {
      res.status(401).json({ message: "No token provided" });
      return;
    }
    try {
      const resp = await verifyToken(access_token);
      res.status(200).json({ user: resp });
    } catch (error) {
      res.status(401).json({
        message: "❌ Invalid token",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}
