import { Router } from "express";
import { CONTROLLER } from "./admin.controller.mjs";
import { verifyToken } from "../../middlewares/verifyToken.mjs";

const app = Router();

app.post("/register", CONTROLLER.register);
app.get("/dashboard", verifyToken, CONTROLLER.dashboard);

export default app;
