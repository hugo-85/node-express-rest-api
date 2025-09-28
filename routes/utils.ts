import { Router } from "express";
import { getDatabase } from "../lib/db.js";
import { RAWG_API_KEY } from "../configs/config.js";

export const utilsRouter = Router();

utilsRouter.get("/test-db", async (_req, res) => {
  try {
    const db = getDatabase();
    // Simple test: get the connection status
    const admin = db.admin();
    const status = await admin.ping();

    res.json({
      message: "✅ MongoDB connection is healthy",
      status: status,
      database: db.databaseName,
    });
  } catch (error) {
    res.status(500).json({
      message: "❌ Error connecting to MongoDB",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

utilsRouter.post("/fill_database_with_rawg", async (_req, res) => {
  try {
    const db = getDatabase();

    const resp = await fetch(
      `https://api.rawg.io/api/games?key=${RAWG_API_KEY}&ordering=-rating&page_size=40`
    );
    const data: any = await resp.json();
    const results = data.results;

    if (!Array.isArray(results)) {
      return res.status(500).json({
        message: "❌ Invalid data format from RAWG API",
      });
    }

    const mappedResults = results.map((game: any) => ({
      id: game.id.toString(),
      name: game.name,
      released: game.released,
      background_image: game.background_image,
      rating: game.rating,
      ratings_count: game.ratings_count,
      platforms: game.platforms
        ? game.platforms.map((p: any) => p.platform.name.toUpperCase())
        : [],
      genres: game.genres
        ? game.genres.map((g: any) => g.name.toUpperCase())
        : [],
    }));

    //insert data into MongoDB collection "games"
    const collection = db.collection("games");
    await collection.deleteMany({}); // Clear existing data
    await collection.insertMany(mappedResults);

    res.json(mappedResults);
  } catch (error) {
    res.status(500).json({
      message: "❌ Error filling database with RAWG",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

utilsRouter.get("/all-genres", async ({}, res) => {
  try {
    const resp = await fetch(
      `https://api.rawg.io/api/games?key=${RAWG_API_KEY}&genres=action&ordering=-rating&page_size=200`
    );
    const data: any = await resp.json();
    const genres = data.results.map((game: any) => game.genres).flat();
    const uniqueGenres = Array.from(
      new Set(genres.map((g: any) => g.name.toUpperCase()))
    );

    res.json({
      totalGenres: uniqueGenres.length,
      genres: uniqueGenres,
    });
  } catch (error) {
    res.status(500).json({
      message: "❌ Error fetching genres",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

utilsRouter.get("/all-platforms", async ({}, res) => {
  try {
    const resp = await fetch(
      `https://api.rawg.io/api/games?key=${RAWG_API_KEY}&genres=action&ordering=-rating&page_size=200`
    );
    const data: any = await resp.json();
    const platforms = data.results.map((game: any) => game.platforms).flat();
    const uniquePlatforms = Array.from(
      new Set(platforms.map((p: any) => p.platform.name.toUpperCase()))
    );

    res.json({
      totalPlatforms: uniquePlatforms.length,
      platforms: uniquePlatforms,
    });
  } catch (error) {
    res.status(500).json({
      message: "❌ Error fetching platforms",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});
