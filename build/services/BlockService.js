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
const Service_1 = __importDefault(require("./Service"));
class BlockService extends Service_1.default {
    getLatestBlockNumber() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.getRequest("getblockcount");
            console.log("Latest block.....", (_a = result.data) === null || _a === void 0 ? void 0 : _a.result);
            return (_b = result.data) === null || _b === void 0 ? void 0 : _b.result;
        });
    }
    getBlockhashByNumber(blockNum) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.getRequest("getblockhash", [blockNum]);
            console.log("Blockhash of block", blockNum, (_a = result.data) === null || _a === void 0 ? void 0 : _a.result);
            return (_b = result.data) === null || _b === void 0 ? void 0 : _b.result;
        });
    }
    getBlock(blockhash) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.getRequest("getblock", [blockhash]);
            return (_a = result.data) === null || _a === void 0 ? void 0 : _a.result;
        });
    }
}
exports.default = BlockService;
