import { Router } from "express";
import { CONTROLLER } from "./employeer.controller.mjs";

const app = Router();

app.post("/register", CONTROLLER.register);

export default app;
