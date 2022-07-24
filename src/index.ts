import express from "express";
import HomeController from "./controllers/HomeController";
import AddressController from './controllers/AddressController';
import AppService from './services/AppService';
import BlockController from './controllers/BlockController';

const app = express();
const port = 2000;
const appService = new AppService();

app.post("/address",AddressController.createAddress)
app.get("/blocks/latest",BlockController.getLatestBlock)
app.get("/", HomeController.index);

app.listen(port,() => {
    console.log(`Bitcoin wallet service running on port ${port}`);
})

appService.syncBlockchainData();
