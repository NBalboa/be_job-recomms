import { Router } from "express";
import { CONTROLLER } from "./user.controller.mjs";

const app = Router();

app.get("/login", CONTROLLER.login);

export default app;
