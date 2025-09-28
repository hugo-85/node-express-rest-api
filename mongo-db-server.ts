import { createApp } from "./index.js";
import AuthModel from "./models/auth.js";
import GameModel from "./models/game.js";

createApp({ authModel: AuthModel, gameModel: GameModel });
