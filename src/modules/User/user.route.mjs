import { Router } from "express";
import { CONTROLLER } from "./user.controller.mjs";

const app = Router();

app.post("/login", CONTROLLER.login);
app.post("/refresh", CONTROLLER.refreshToken);
app.patch("/logout/:id", CONTROLLER.logout);

export default app;
