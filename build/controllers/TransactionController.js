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
const Controller_1 = __importDefault(require("./Controller"));
const TransactionService_1 = __importDefault(require("../services/TransactionService"));
const transactions_1 = require("../helpers/transactions");
const bitcoinjs_lib_1 = require("bitcoinjs-lib");
const dataSource_1 = __importDefault(require("../config/dataSource"));
const Address_1 = __importDefault(require("../entities/Address"));
const AddressServices_1 = __importDefault(require("../services/AddressServices"));
const crypto_js_1 = __importDefault(require("crypto-js"));
const TxnInput_1 = __importDefault(require("./../entities/TxnInput"));
const settings_1 = require("../config/settings");
const ValidationException_1 = __importDefault(require("./../exceptions/ValidationException"));
const transaction_errors_1 = require("../config/errors/transaction.errors");
class TransactionController extends Controller_1.default {
    static getRawTransaction({ req, res }) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (new TransactionService_1.default()).getRawTransaction(req.params.tx_hash);
        });
    }
    static verifyTransaction({ req, res }) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, value, address, tx_id } = req.body;
            const txnInputRepo = dataSource_1.default.getRepository(TxnInput_1.default);
            const matched = yield txnInputRepo.findOneBy({ txId: tx_id });
            if (matched !== null) {
                if (matched.address === address && matched.value == value && matched.received === false) {
                    yield txnInputRepo.update({ id: matched.id }, { received: true });
                    return {
                        verified: true
                    };
                }
            }
            throw new ValidationException_1.default(transaction_errors_1.transactionErrors.txnVerificationFailed);
        });
    }
    static createTransaction({ req, res }) {
        var e_1, _a;
        var _b;
        return __awaiter(this, void 0, void 0, function* () {
            const { address, amount } = req.body;
            console.log("submitted data...", req.body.address, req.body.amount);
            const txnParams = yield (0, transactions_1.prepareTxnParams)([{ address, value: amount }]);
            const psbt = new bitcoinjs_lib_1.Psbt({ network: (new TransactionService_1.default()).network });
            const addressRepo = dataSource_1.default.getRepository(Address_1.default);
            txnParams.inputs.forEach((input) => {
                psbt.addInput({
                    hash: input.txId,
                    index: input.vout,
                    witnessUtxo: {
                        script: Buffer.from(input.scriptPubKey, "hex"),
                        value: input.value
                    }
                });
            });
            txnParams.outputs.forEach((output) => {
                psbt.addOutput({
                    address: output.address,
                    value: output.value
                });
            });
            let index = 0;
            try {
                for (var _c = __asyncValues(txnParams.inputs), _d; _d = yield _c.next(), !_d.done;) {
                    const input = _d.value;
                    const addressData = yield addressRepo.findOne({ where: { address: input.address } });
                    if (addressData !== null) {
                        const wif = crypto_js_1.default.AES.decrypt(addressData.wifCrypt, settings_1.ENCRYPTION_SALT !== null && settings_1.ENCRYPTION_SALT !== void 0 ? settings_1.ENCRYPTION_SALT : "").toString(crypto_js_1.default.enc.Utf8);
                        const ecpair = (new AddressServices_1.default()).getEcpair();
                        const wallet = ecpair.fromWIF(wif);
                        psbt.signInput(index, wallet);
                        psbt.validateSignaturesOfInput(index, transactions_1.validateInputSignatures);
                    }
                    index++;
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_a = _c.return)) yield _a.call(_c);
                }
                finally { if (e_1) throw e_1.error; }
            }
            psbt.finalizeAllInputs();
            const txn = psbt.extractTransaction();
            const txnHex = txn.toHex();
            const txnId = txn.getId();
            const txnService = new TransactionService_1.default();
            //Test Acceptance 
            const acceptanceResult = yield txnService.testMempoolAcceptance([txnHex]);
            let acceptable = false;
            if (acceptanceResult !== undefined && acceptanceResult !== null && ((_b = acceptanceResult[0]) === null || _b === void 0 ? void 0 : _b.allowed) === true) {
                acceptable = true;
                yield txnService.publishTransaction(txnHex);
                console.log("transaction sent ", txnHex);
                yield (0, transactions_1.recordSentTransaction)(txnId, txnParams.inputs);
            }
            return { txnId, txnHex, address, amount, txnFee: txnParams.transactionFee, acceptable };
        });
    }
}
exports.default = TransactionController;
