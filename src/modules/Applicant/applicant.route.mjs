import { Router } from "express";
import { CONTROLLER } from "./applicant.controller.mjs";

const app = Router();

app.get("/", CONTROLLER.all);
app.get("/:id", CONTROLLER.applicant);
app.post("/register", CONTROLLER.register);
app.delete("/:applicant_id", CONTROLLER.delete);

export default app;
