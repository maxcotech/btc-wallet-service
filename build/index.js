"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const HomeController_1 = __importDefault(require("./controllers/HomeController"));
const AddressController_1 = __importDefault(require("./controllers/AddressController"));
const AppService_1 = __importDefault(require("./services/AppService"));
const BlockController_1 = __importDefault(require("./controllers/BlockController"));
const dataSource_1 = __importDefault(require("./config/dataSource"));
const TransactionController_1 = __importDefault(require("./controllers/TransactionController"));
const body_parser_1 = __importDefault(require("body-parser"));
const Controller_1 = __importDefault(require("./controllers/Controller"));
const MessageService_1 = __importDefault(require("./services/MessageService"));
const auth_helpers_1 = require("./helpers/auth_helpers");
const settings_1 = require("./config/settings");
const app = (0, express_1.default)();
const jsonParser = body_parser_1.default.json();
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield dataSource_1.default.initialize();
        console.log('App Data Store initialized.');
        app.post("/address", jsonParser, yield (0, auth_helpers_1.requireAuthKey)(AddressController_1.default.createAddress));
        app.get("/blocks/latest", yield (0, auth_helpers_1.requireAuthKey)(BlockController_1.default.getLatestBlock));
        app.get("/blocks/:blockNumber/hash", yield (0, auth_helpers_1.requireAuthKey)(BlockController_1.default.getBlockHash));
        app.get("/block/:blockhash", yield (0, auth_helpers_1.requireAuthKey)(BlockController_1.default.getBlock));
        app.get("/transactions/:tx_hash", yield (0, auth_helpers_1.requireAuthKey)(TransactionController_1.default.getRawTransaction));
        app.get("/", HomeController_1.default.index);
        app.post("/transaction", jsonParser, yield (0, auth_helpers_1.requireAuthKey)(TransactionController_1.default.createTransaction));
        app.post("/transaction/verify", jsonParser, yield (0, auth_helpers_1.requireAuthKey)(TransactionController_1.default.verifyTransaction));
        app.get("/ping", yield (0, auth_helpers_1.requireAuthKey)(Controller_1.default.ping));
        app.listen(settings_1.PORT, () => {
            console.log(`Bitcoin wallet service running on PORT ${settings_1.PORT}`);
        });
        const appService = new AppService_1.default();
        const messageService = new MessageService_1.default();
        //appService.syncBlockchainData();
        messageService.processMessageQueue();
    }
    catch (e) {
        console.log("Failed to initialize App ", e);
    }
}))();
