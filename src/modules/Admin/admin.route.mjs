import { Router } from "express";
import { CONTROLLER } from "./admin.controller.mjs";

const app = Router();

app.post("/register", CONTROLLER.register);

export default app;
