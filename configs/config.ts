export const {
  PORT = 1234,
  MONGODB_URI = "mongodb://localhost:27017",
  DATABASE_NAME = "gamedb",
  RAWG_API_KEY = "",
  SALT_ROUNDS = "10",
  JWT_SECRET_KEY,
} = process.env;
