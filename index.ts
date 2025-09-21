import "dotenv/config";
import express, { json } from "express";
import { connectToDatabase } from "./lib/db.js";
import { createGameRouter } from "./routes/games.js";
import { corsMiddleware } from "./middlewares/cors.js";
import { utilsRouter } from "./routes/utils.js";
import { TGameModel } from "./interfaces/modelInterfaces.js";

export const createApp = ({ gameModel }: { gameModel: TGameModel }) => {
  const app = express();

  const PORT = process.env.PORT || 1234;

  app.disable("x-powered-by"); // disabled header X-Powered-By: Express

  // Middleware
  app.use(json());
  app.use(corsMiddleware());

  // Sample route
  app.get("/", (_req, res) => {
    res.send("Hello, World!");
  });

  app.use("/api/games", createGameRouter({ gameModel: gameModel }));
  app.use("/api/utils", utilsRouter);

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
