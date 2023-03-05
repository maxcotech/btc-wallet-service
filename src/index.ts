import express from "express";
import HomeController from "./controllers/HomeController";
import AddressController from './controllers/AddressController';
import AppService from './services/AppService';
import BlockController from './controllers/BlockController';
import AppDataSource from './config/dataSource';
import TransactionController from './controllers/TransactionController';
import bodyParser from "body-parser";
import Controller from './controllers/Controller';
import MessageService from "./services/MessageService";
import { requireAuthKey } from "./helpers/auth_helpers";
import { PORT } from "./config/settings";

const app = express();
const jsonParser = bodyParser.json();

(async () => {
    try{
        await AppDataSource.initialize();
        console.log('App Data Store initialized.');
        const appService = new AppService();
        const messageService = new MessageService();
        app.post("/address",jsonParser, await requireAuthKey(AddressController.createAddress))
        app.get("/blocks/latest",await requireAuthKey(BlockController.getLatestBlock))
        app.get("/blocks/:blockNumber/hash",await requireAuthKey(BlockController.getBlockHash));
        app.get("/block/:blockhash",await requireAuthKey(BlockController.getBlock));
        app.get("/transactions/:tx_hash",await requireAuthKey(TransactionController.getRawTransaction));
        app.get("/", HomeController.index);
        app.post("/transaction",jsonParser,await requireAuthKey(TransactionController.createTransaction));
        app.post("/transaction/verify",jsonParser,await requireAuthKey(TransactionController.verifyTransaction));
        app.get("/ping",await requireAuthKey(Controller.ping));
        app.get('/retry-failed', async (req,res) => res.json({message:await messageService.reQueueFailedMessages()}))

        app.listen(PORT,() => {
            console.log(`Bitcoin wallet service running on PORT ${PORT}`);
        })

        appService.syncBlockchainData();
        messageService.processMessageQueue();
    }
    catch(e){
        console.log("Failed to initialize App ", e)
    }

})()





