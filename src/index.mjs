// const express = require("express");
import express from "express";
import { routers } from "./middlewares/routers.mjs";
import { testConnection } from "./configs/database.mjs";
const app = express();
const PORT = 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

routers(app);

app.listen(PORT, () => {
    console.log(`port running on ${PORT} locally`);
    testConnection();
});
