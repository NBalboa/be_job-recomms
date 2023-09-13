import { Router } from "express";
import { CONTROLLER } from "./applicant.controller.mjs";

const app = Router();

app.post("/register", CONTROLLER.register);
app.delete("/delete/:applicant_id", CONTROLLER.delete);
app.get("/all", CONTROLLER.all);
app.get("/:id", CONTROLLER.applicant);

export default app;
