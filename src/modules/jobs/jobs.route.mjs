import { Router } from "express";
import { CONTROLLER } from "./jobs.controller.mjs";
const app = Router();
app.get("/", CONTROLLER.jobs);
app.get("/:id", CONTROLLER.jobDetails);
app.post("/register/:hiringManagerId", CONTROLLER.register);
app.post("/qualifications/register/:jobId", CONTROLLER.registerQualifications);

export default app;
