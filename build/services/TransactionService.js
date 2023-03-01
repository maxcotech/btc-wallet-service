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
const axios_1 = __importDefault(require("axios"));
const Service_1 = __importDefault(require("./Service"));
class TransactionService extends Service_1.default {
    getRawTransaction(txHash, isJson = true) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.getRequest("getrawtransaction", [txHash, isJson]);
            return (_a = result.data) === null || _a === void 0 ? void 0 : _a.result;
        });
    }
    getFeeDensity() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield axios_1.default.get(this.feeDensityUrl);
            return result.data;
        });
    }
    testMempoolAcceptance(transactions) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.getRequest("testmempoolaccept", [transactions]);
            return (_a = result.data) === null || _a === void 0 ? void 0 : _a.result;
        });
    }
    publishTransaction(txnHex) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.getRequest("sendrawtransaction", [txnHex]);
            return (_a = result.data) === null || _a === void 0 ? void 0 : _a.result;
        });
    }
}
exports.default = TransactionService;
