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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Service_1 = __importDefault(require("./Service"));
const dataSource_1 = __importDefault(require("./../config/dataSource"));
const IndexedBlock_1 = __importDefault(require("../entities/IndexedBlock"));
const BlockService_1 = __importDefault(require("./BlockService"));
const TransactionService_1 = __importDefault(require("./TransactionService"));
const Address_1 = __importDefault(require("../entities/Address"));
const TxnInput_1 = __importDefault(require("../entities/TxnInput"));
const MessageService_1 = __importDefault(require("./MessageService"));
class AppService extends Service_1.default {
    constructor() {
        super();
        this.timer = 1000 * 10; // Default 10 secs Interval
        this.indexedBlockRepo = dataSource_1.default.getRepository(IndexedBlock_1.default);
        this.addressRepo = dataSource_1.default.getRepository(Address_1.default);
        this.txnInputRepo = dataSource_1.default.getRepository(TxnInput_1.default);
        this.blockService = new BlockService_1.default();
        this.txnService = new TransactionService_1.default();
        console.log("Blockchain Synchronizing Service Initialized.");
    }
    syncBlockchainData() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                    let indexed = yield this.indexedBlockRepo.count();
                    if (indexed === 0) {
                        console.log('No Indexed Block', this.timer);
                        yield this.indexLatestBlock();
                        this.timer = 1000 * 60 * 10; // 10 minutes interval;
                    }
                    else {
                        const latestNum = yield this.blockService.getLatestBlockNumber();
                        if (latestNum !== undefined && latestNum !== null) {
                            if (yield this.isNewBlock(latestNum)) {
                                if (yield this.blocksAreMissing(latestNum)) {
                                    this.timer = 1000; // to quickly process missing blocks, 1 secs interval
                                    const nextIndex = yield this.getNextToIndexNumber(latestNum);
                                    yield this.indexBlockByNumber(nextIndex);
                                }
                                else {
                                    yield this.indexBlockByNumber(latestNum);
                                    this.timer = 1000 * 60 * 10; //10 minuites interval;
                                }
                            }
                            else {
                                this.timer = 1000 * 60 * 10; //increase timer to check again in 10 mins 
                            }
                        }
                    }
                    this.syncBlockchainData();
                }), this.timer);
            }
            catch (e) {
                if (e instanceof Error) {
                    console.log(e.name, e.message, e.stack);
                }
            }
        });
    }
    isNewBlock(latestNum) {
        return __awaiter(this, void 0, void 0, function* () {
            const highestIndex = yield this.getHighestIndexInDb();
            if (highestIndex !== null) {
                if (latestNum > highestIndex.blockNumber) {
                    return true;
                }
            }
            return false;
        });
    }
    blocksAreMissing(latestNum) {
        return __awaiter(this, void 0, void 0, function* () {
            const highestIndex = yield this.getHighestIndexInDb();
            if (highestIndex !== null && highestIndex !== undefined) {
                if ((latestNum - highestIndex.blockNumber) > 1) {
                    console.log('Blocks were missed between ', latestNum, "and", highestIndex.blockNumber);
                    return true;
                }
            }
            return false;
        });
    }
    indexBlockByNumber(blockNum) {
        var e_1, _a;
        return __awaiter(this, void 0, void 0, function* () {
            const blockhash = yield this.blockService.getBlockhashByNumber(blockNum);
            if (blockhash !== null && blockhash !== undefined) {
                const block = yield this.blockService.getBlock(blockhash);
                if (block !== undefined) {
                    try {
                        for (var _b = __asyncValues(block.tx), _c; _c = yield _b.next(), !_c.done;) {
                            let txn = _c.value;
                            yield this.processTransaction(txn);
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (_c && !_c.done && (_a = _b.return)) yield _a.call(_b);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                    let highestIndex = yield this.getHighestIndexInDb();
                    if (highestIndex !== null) {
                        highestIndex.blockNumber = blockNum;
                        yield this.indexedBlockRepo.save(highestIndex);
                    }
                    else {
                        let latestIndex = new IndexedBlock_1.default();
                        latestIndex.blockNumber = blockNum;
                        yield this.indexedBlockRepo.save(latestIndex);
                    }
                    console.log("Block Processed", blockNum);
                    return true;
                }
            }
            console.log('failed to index block with number ', blockNum);
            return false;
        });
    }
    getNextToIndexNumber(latestNum = 0) {
        return __awaiter(this, void 0, void 0, function* () {
            const highestIndex = yield this.getHighestIndexInDb();
            if (highestIndex !== null && highestIndex !== undefined) {
                const nextIndex = (highestIndex === null || highestIndex === void 0 ? void 0 : highestIndex.blockNumber) + 1;
                if (nextIndex < latestNum) {
                    return nextIndex;
                }
            }
            return latestNum;
        });
    }
    getHighestIndexInDb() {
        return __awaiter(this, void 0, void 0, function* () {
            const highestIndex = yield this.indexedBlockRepo.find({ order: { blockNumber: "DESC" }, skip: 0, take: 1 });
            if (highestIndex !== null && highestIndex !== undefined && highestIndex.length > 0) {
                return highestIndex[0];
            }
            return null;
        });
    }
    processTransaction(txnHash) {
        var e_2, _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("processing transaction ", txnHash);
                const txn = yield this.txnService.getRawTransaction(txnHash, true);
                if (txn !== undefined) {
                    try {
                        for (var _b = __asyncValues(txn.vout), _c; _c = yield _b.next(), !_c.done;) {
                            let voutItem = _c.value;
                            const scriptPubKey = voutItem.scriptPubKey;
                            if (scriptPubKey.address !== undefined) {
                                const addrRecord = yield this.addressRepo.findOneBy({ address: voutItem.scriptPubKey.address });
                                if (addrRecord !== null && ((yield this.txnInputRepo.findOneBy({ txId: txn.txid })) === null)) {
                                    const newInput = new TxnInput_1.default();
                                    newInput.address = scriptPubKey.address;
                                    newInput.scriptPubKey = scriptPubKey.hex;
                                    newInput.txId = txn.txid;
                                    newInput.txnHash = txn.hash;
                                    newInput.vout = voutItem.n;
                                    newInput.value = voutItem.value;
                                    newInput.spent = false;
                                    const savedInput = yield this.txnInputRepo.save(newInput);
                                    const messageService = new MessageService_1.default();
                                    yield messageService.queueCreditTransaction(savedInput);
                                }
                            }
                        }
                    }
                    catch (e_2_1) { e_2 = { error: e_2_1 }; }
                    finally {
                        try {
                            if (_c && !_c.done && (_a = _b.return)) yield _a.call(_b);
                        }
                        finally { if (e_2) throw e_2.error; }
                    }
                    //console.log("processed transaction",txnHash);
                    return true;
                }
                console.log('failed to process transaction with hash', txnHash);
                return false;
            }
            catch (e) {
                console.log('Failed to process transaction ', txnHash);
                return false;
            }
        });
    }
    indexLatestBlock() {
        return __awaiter(this, void 0, void 0, function* () {
            const latestBlock = yield this.blockService.getLatestBlockNumber();
            if (latestBlock !== null && latestBlock !== undefined) {
                if ((yield this.indexedBlockRepo.findOneBy({ blockNumber: latestBlock })) === null) {
                    if (yield this.indexBlockByNumber(latestBlock)) {
                        return true;
                    }
                }
            }
            return false;
        });
    }
}
exports.default = AppService;
