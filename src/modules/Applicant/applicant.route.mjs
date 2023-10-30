import { Router } from "express";
import { CONTROLLER } from "./applicant.controller.mjs";

const app = Router();

app.get("/", CONTROLLER.all);
app.get("/:id", CONTROLLER.applicant);
app.post("/register", CONTROLLER.register);
app.post("/current_address/:applicantId", CONTROLLER.current_address);
app.post("/permanent_address/:applicantId", CONTROLLER.permanent_address);
app.post("/educations/:applicantId", CONTROLLER.education);
app.post("/experiences/:applicantId", CONTROLLER.experience);
app.post("/skills/:applicantId", CONTROLLER.skills);
app.delete("/:applicant_id", CONTROLLER.delete);

export default app;
