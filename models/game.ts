import { randomUUID } from "node:crypto";
import { getDatabase } from "../lib/db";

type filterParams = {
  page: number;
  limit: number;
  skip: number;
  genre: string;
  platform: string;
};

export const getAllGames = async ({ filters }: { filters: filterParams }) => {
  try {
    const { page, limit, skip, genre, platform } = filters;
    const db = getDatabase();
    const collection = db.collection("games");

    const filter: any = {};
    if (genre) {
      filter.genres = genre;
    }
    if (platform) {
      filter.platforms = platform;
    }

    const totalGames = await collection.countDocuments();
    const games = await collection
      .find(filter)
      .skip(skip)
      .limit(limit)
      .toArray();

    return {
      page,
      totalPages: Math.ceil(totalGames / limit),
      totalGames,
      games,
    };
  } catch (error) {
    // console.error("❌ Error fetching games:", error);
    throw new Error("❌ Error fetching games");
  }
};

export const getGame = async ({ gameId }: { gameId: string }) => {
  try {
    const db = getDatabase();
    const collection = db.collection("games");
    const game = await collection.findOne({ id: gameId });

    if (!game) {
      return {
        status: 404,
        message: "❌ Game not found",
      };
    }

    return {
      status: 200,
      game,
    };
  } catch (error) {
    // console.error("❌ Error fetching game:", error);
    return {
      status: 500,
      message: "❌ Error fetching game",
    };
  }
};

export const createGame = async ({ newGame }: { newGame: any }) => {
  try {
    const db = getDatabase();
    const collection = db.collection("games");

    const id = randomUUID();

    // Check for duplicate ID
    const existingGame = await collection.findOne({ id });
    if (existingGame) {
      return {
        status: 409,
        message: "❌ Game with this ID already exists",
      };
    }

    await collection.insertOne({ id, ...newGame });
    return {
      status: 201,
      message: "✅ Game created successfully",
      game: { ...newGame, id },
    };
  } catch (error) {
    // console.error("❌ Error creating game:", error);
    return {
      status: 500,
      message: "❌ Error creating game",
    };
  }
};

export const updateGame = async ({
  gameId,
  updateData,
}: {
  gameId: string;
  updateData: any;
}) => {
  try {
    const db = getDatabase();
    const collection = db.collection("games");

    const result = await collection.updateOne(
      { id: gameId },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return {
        status: 404,
        message: "❌ Game not found",
      };
    }

    return {
      status: 200,
      message: "✅ Game updated successfully",
      game: { id: gameId, ...updateData },
    };
  } catch (error) {
    // console.error("❌ Error updating game:", error);
    return {
      status: 500,
      message: "❌ Error updating game",
    };
  }
};

export const deleteGame = async ({ gameId }: { gameId: string }) => {
  try {
    const db = getDatabase();
    const collection = db.collection("games");

    const result = await collection.deleteOne({ id: gameId });

    if (result.deletedCount === 0) {
      return {
        status: 404,
        message: "❌ Game not found",
      };
    }

    return {
      status: 200,
      message: "✅ Game deleted successfully",
    };
  } catch (error) {
    // console.error("❌ Error deleting game:", error);
    return {
      status: 500,
      message: "❌ Error deleting game",
    };
  }
};
