import z from "zod";

// Schema for a game object
// {
//   "id": 964507,
//   "name": "Geometry Dash RazorLeaf",
//   "released": "2023-07-19",
//   "background_image": "https://media.rawg.io/media/screenshots/8ad/8ad83b99a7ea2116a72688ba26644b3f.jpg",
//   "rating": 4.83,
//   "ratings_count": 5,
//   "platforms": [
//     "ANDROID",
//     "PC"
//   ],
//   "genres": [
//     "ARCADE",
//     "CASUAL",
//     "INDIE"
//   ]
// }

// Genres available in RAWG API
const genres = z.enum([
  "ACTION",
  "RPG",
  "STRATEGY",
  "INDIE",
  "PLATFORMER",
  "ADVENTURE",
  "FIGHTING",
  "SHOOTER",
  "SIMULATION",
  "CASUAL",
  "MASSIVELY MULTIPLAYER",
]);

// PLatforms available in RAWG API
const platforms = z.enum([
  "PC",
  "XBOX SERIES S/X",
  "GAME BOY ADVANCE",
  "WEB",
  "PLAYSTATION 3",
  "PLAYSTATION 4",
  "XBOX",
  "PLAYSTATION 2",
  "MACOS",
  "LINUX",
  "NINTENDO SWITCH",
  "IOS",
  "ANDROID",
  "NES",
  "PLAYSTATION 5",
  "XBOX ONE",
  "WII",
  "NINTENDO DS",
  "XBOX 360",
  "WII U",
  "GAMECUBE",
]);

export const GameSchema = z.object({
  id: z.string().optional(), // Game ID from RAWG
  name: z.string(), // Name of the game
  released: z
    .string()
    .regex(
      /^\d{4}-\d{2}-\d{2}$/,
      "Date format should be YYYY-MM-DD (ej: 2015-09-23)"
    )
    .nullable(), // Release date in YYYY-MM-DD format (can be null)
  background_image: z.url("Url image can't be null"), // URL to the background image (can't be null)
  rating: z.number(), // Average rating
  ratings_count: z.number(), // Number of ratings
  platforms: z.array(platforms), // List of platforms
  genres: z.array(genres), // List of genres
});

export function validateGame(data: any) {
  return GameSchema.safeParse(data);
}

export function validateParcialGame(data: any) {
  return GameSchema.partial().safeParse(data);
}

export type Game = z.infer<typeof GameSchema>;

export const GamesArraySchema = z.array(GameSchema);
export type GamesArray = z.infer<typeof GamesArraySchema>;
