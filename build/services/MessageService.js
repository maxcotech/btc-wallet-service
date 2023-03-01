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
const axios_1 = require("axios");
const Service_1 = __importDefault(require("./Service"));
const settings_1 = require("../config/settings");
const MessageQueue_1 = __importDefault(require("../entities/MessageQueue"));
const enum_1 = require("../config/enum");
const typeorm_1 = require("typeorm");
const dataSource_1 = __importDefault(require("../config/dataSource"));
const FailedQueueMessage_1 = __importDefault(require("../entities/FailedQueueMessage"));
class MessageService extends Service_1.default {
    constructor() {
        super();
        this.client = this.getAppClient();
        this.messageRepo = dataSource_1.default.getRepository(MessageQueue_1.default);
        this.failedMessageRepo = dataSource_1.default.getRepository(FailedQueueMessage_1.default);
    }
    sendIncomingTransaction(payload, retrial = 10, trialIntervalMins = 5) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.client.post(`transactions/chain/incoming/BTC`, payload);
                console.log(`Successfully Notified app of transaction with system id ${payload.id} and Address ${payload.address}`);
            }
            catch (e) {
                if (e instanceof Error) {
                    console.log(`Failed to send transaction message with address ${payload.address} and system id ${payload.id} retrying in ${trialIntervalMins} mins: remaining trial count is ${retrial}`, e.message, e.stack);
                    if (retrial > 0) {
                        const newRetrial = retrial - 1;
                        const newInterval = trialIntervalMins * 2;
                        setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                            yield this.sendIncomingTransaction(payload, newRetrial, newInterval);
                        }), 1000 * 60 * trialIntervalMins);
                    }
                }
            }
        });
    }
    fetchQueue() {
        return __awaiter(this, void 0, void 0, function* () {
            const messages = yield this.messageRepo.find({
                order: { retries: 'ASC' },
                take: 100,
                skip: 0,
                where: { message: (0, typeorm_1.Not)("") }
            });
            messages;
            return messages;
        });
    }
    processMessageQueue(timeout = 5000) {
        return __awaiter(this, void 0, void 0, function* () {
            setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                var _a;
                let currentItem = null;
                try {
                    const queue = yield this.fetchQueue();
                    const queueLength = queue.length;
                    if (queueLength > 0) {
                        for (let i = 0; i < queueLength; i++) {
                            currentItem = queue[i];
                            const messagePayload = JSON.parse(currentItem.message);
                            const response = yield this.client.post(`transactions/chain/incoming/${settings_1.WALLET_DEFAULT_SYMBOL}`, messagePayload);
                            if (response.status === 200) {
                                console.log(`message sent successfully`, currentItem.message);
                                yield this.messageRepo.delete({ id: currentItem.id });
                            }
                        }
                    }
                    this.processMessageQueue();
                }
                catch (e) {
                    console.log('Failed to Send Pending Messages ', (e instanceof axios_1.AxiosError) ? (_a = e.response) === null || _a === void 0 ? void 0 : _a.data : ((e instanceof Error) ? e.message : ""));
                    if (currentItem) {
                        if (currentItem.retries >= settings_1.MESSAGE_RETRY_LIMIT) {
                            yield this.moveToFailedMessageRecord(currentItem);
                        }
                        else {
                            yield this.messageRepo.update({ id: currentItem.id }, { retries: currentItem.retries + 1 });
                        }
                    }
                    this.processMessageQueue();
                }
            }), timeout);
        });
    }
    moveToFailedMessageRecord(message) {
        return __awaiter(this, void 0, void 0, function* () {
            const newFailedMsg = new FailedQueueMessage_1.default();
            newFailedMsg.message = message.message;
            newFailedMsg.retried = message.retries;
            newFailedMsg.messageId = message.id;
            newFailedMsg.type = message.type;
            let savedFailedMsg = null;
            yield dataSource_1.default.transaction(() => __awaiter(this, void 0, void 0, function* () {
                savedFailedMsg = yield this.failedMessageRepo.save(newFailedMsg);
                yield this.messageRepo.delete({ id: message.id });
            }));
            return savedFailedMsg;
        });
    }
    queueCreditTransaction(txnData) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('queueing for messaging', txnData);
                const messagePayload = {
                    address: txnData.address,
                    value: txnData.value,
                    tx_id: txnData.txId,
                    currency_code: settings_1.WALLET_DEFAULT_SYMBOL,
                    address_memo: null
                };
                const messageString = JSON.stringify(messagePayload);
                const messageQueue = new MessageQueue_1.default();
                messageQueue.message = messageString;
                console.log('message string', (_a = messageQueue.message) !== null && _a !== void 0 ? _a : "none", messageString);
                messageQueue.type = enum_1.MessageTypes.creditTransaction;
                yield this.messageRepo.save(messageQueue);
                return true;
            }
            catch (e) {
                if (e instanceof Error) {
                    console.log(e.message, e.stack);
                }
                return false;
            }
        });
    }
}
exports.default = MessageService;
