import express from "express";
import HomeController from "./controllers/HomeController";

const app = express();
const port = 2000;

app.get("/", HomeController.index);

app.listen(port,() => {
    console.log(`Bitcoin wallet service running on port ${port}`);
})