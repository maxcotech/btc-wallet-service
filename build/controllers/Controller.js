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
const MessageService_1 = __importDefault(require("../services/MessageService"));
const TxnInput_1 = __importDefault(require("./../entities/TxnInput"));
class Controller {
    static ping({ req, res }) {
        return __awaiter(this, void 0, void 0, function* () {
            const messageService = new MessageService_1.default();
            const txnInput = new TxnInput_1.default();
            txnInput.address = "tb1q7wfy3ncf6jgstk735kexnurt0zpr5ya8tcttk5";
            txnInput.txId = "63aa087c7a0e703e11ef198b6e9d4c404bbdc3ec0ccdcfca9b84f5e7461d7dfb";
            txnInput.txnHash = "68c3be2ccebd906912ec65229588fecac3ff1bd7341660463dea8b241e2b22d4";
            txnInput.value = 0.00066193;
            txnInput.id = 7;
            yield messageService.queueCreditTransaction(txnInput);
            return {
                message: "queued successfully"
            };
        });
    }
}
exports.default = Controller;
