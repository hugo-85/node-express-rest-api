import { getDatabase } from "../lib/db.js";
import bcrypt from "bcrypt";
import { SALT_ROUNDS } from "../configs/config.js";

const loginWithEmail = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<{ ok: boolean; user?: any; message?: string }> => {
  try {
    const db = getDatabase();
    const collection = db.collection("users");

    const dbUser = await collection.findOne({ email });
    console.log("Found user:", dbUser);
    if (!dbUser) {
      return {
        ok: false,
        message: "User not found",
      };
    }

    const passwordMatch = await bcrypt.compare(password, dbUser.password);
    if (!passwordMatch) {
      return {
        ok: false,
        message: "Invalid password",
      };
    }

    const user = {
      email: dbUser.email,
    };

    return {
      ok: true,
      user,
    };
  } catch (error) {
    throw new Error("Error logging in user");
  }
};
const createUser = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<{ created: boolean; id?: string; message?: string }> => {
  try {
    const db = getDatabase();
    const collection = db.collection("users");

    const userExists = await collection.findOne({ email });
    if (userExists) {
      return { created: false, message: "User already exists" };
    }

    const hashedPassword = await bcrypt.hash(password, parseInt(SALT_ROUNDS));

    const newUser = await collection.insertOne({
      email,
      password: hashedPassword,
    });

    return {
      created: newUser.acknowledged,
      id: newUser.insertedId.toString(),
    };
  } catch (error) {
    throw new Error("Error creating user");
  }
};

export default { loginWithEmail, createUser };
