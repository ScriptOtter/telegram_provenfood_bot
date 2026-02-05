import * as dotenv from "dotenv";
dotenv.config();

export const ENV = {
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || "",
  TELEGRAM_FULL_TOKEN: process.env.TELEGRAM_FULL_TOKEN || "",
  DATABASE_URL: process.env.DATABASE_URL || "",
};
