import "dotenv/config";
import express, { json } from "express";
import { connectToDatabase } from "./lib/db.js";
import { createGameRouter } from "./routes/games.js";
import { corsMiddleware } from "./middlewares/cors.js";
import { utilsRouter } from "./routes/utils.js";
import { TAuthModel, TGameModel } from "./interfaces/modelInterfaces.js";
import { PORT } from "./configs/config.js";
import { createAuthRouter } from "./routes/auth.js";
import cookieParser from "cookie-parser";

export const createApp = ({
  authModel,
  gameModel,
}: {
  authModel: TAuthModel;
  gameModel: TGameModel;
}) => {
  const app = express();

  app.disable("x-powered-by"); // disabled header X-Powered-By: Express

  // Middleware
  app.use(json());
  app.use(corsMiddleware());
  app.use(cookieParser());

  // Sample route
  app.get("/", (_req, res) => {
    res.send("Hello, World!");
  });

  app.use("/api/auth", createAuthRouter({ authModel: authModel }));
  app.use("/api/utils", utilsRouter);
  app.use("/api/games", createGameRouter({ gameModel: gameModel }));

  // Start the server with database connection
  async function startServer() {
    try {
      // Connect to MongoDB first
      await connectToDatabase();

      // Then start the server
      app.listen(PORT, () => {
        console.log(`🚀 Server is running on http://localhost:${PORT}`);
      });
    } catch (error) {
      console.error("❌ Error starting server:", error);
      process.exit(1);
    }
  }

  startServer();
};
