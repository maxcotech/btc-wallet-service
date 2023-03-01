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
const Controller_1 = __importDefault(require("./Controller"));
const BlockService_1 = __importDefault(require("../services/BlockService"));
class BlockController extends Controller_1.default {
    static getLatestBlock({ req, res }) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (new BlockService_1.default()).getLatestBlockNumber();
        });
    }
    static getBlockHash({ req, res }) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (new BlockService_1.default()).getBlockhashByNumber(parseInt(req.params.blockNumber));
        });
    }
    static getBlock({ req, res }) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (new BlockService_1.default()).getBlock(req.params.blockhash);
        });
    }
}
exports.default = BlockController;
