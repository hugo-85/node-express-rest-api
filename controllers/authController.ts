import { Request, Response } from "express";
import { TAuthIController, TUserBody } from "../interfaces/authInterface";
import { validateAuth } from "../schemas/auth";
import { TAuthModel } from "../interfaces/modelInterfaces";
import jwt from "jsonwebtoken";

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
        "your_jwt_secret",
        { expiresIn: "1h" }
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

  async logout(req: Request, res: Response) {
    // Perform logout logic here

    res.status(200).json({ message: "Logout successful" });
  }
}
