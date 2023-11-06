// const { config } = require("dotenv");
import { config } from "dotenv";

config();

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3001;
const DB_HOST = process.env.DB_HOST ?? null;
const DB_PASS = process.env.DB_PASS ?? null;
const DATABASE = process.env.DATABASE ?? null;
const DB_USER = process.env.DB_USER ?? null;
const SALT_ROUNDS = process.env.SALTROUNDS
    ? parseInt(process.env.SALTROUNDS)
    : null;
const ACCESS_TOKEN = process.env.ACCESS_TOKEN ?? null;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN ?? null;
const OTP_TOKEN = process.env.OTP_TOKEN ?? null;
const GMAIL = process.env.GMAIL;
const PASSWORD = process.env.PASSWORD;

export {
    PORT,
    DB_HOST,
    DB_PASS,
    DATABASE,
    DB_USER,
    SALT_ROUNDS,
    ACCESS_TOKEN,
    REFRESH_TOKEN,
    GMAIL,
    PASSWORD,
    OTP_TOKEN,
};
