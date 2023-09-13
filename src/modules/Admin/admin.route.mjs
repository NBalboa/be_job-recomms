import { Router } from "express";
import { CONTROLLER } from "./admin.controller.mjs";

const app = Router();

app.get("/register", CONTROLLER.register);

export default app;
