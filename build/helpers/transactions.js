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
exports.recordSentTransaction = exports.validateInputSignatures = exports.deductFeeFromOutputs = exports.calculateTransactionFees = exports.getInputsForAmount = exports.prepareTxnParams = void 0;
const dataSource_1 = __importDefault(require("../config/dataSource"));
const TxnInput_1 = __importDefault(require("../entities/TxnInput"));
const array_helpers_1 = require("./array_helpers");
const InsufficientInputs_1 = __importDefault(require("./../exceptions/InsufficientInputs"));
const TransactionService_1 = __importDefault(require("../services/TransactionService"));
const conversions_1 = require("./conversions");
const AddressServices_1 = __importDefault(require("../services/AddressServices"));
const SpentInput_1 = __importDefault(require("../entities/SpentInput"));
const SentTransaction_1 = __importDefault(require("../entities/SentTransaction"));
const settings_1 = require("../config/settings");
const wallet_errors_1 = require("../config/errors/wallet.errors");
function prepareTxnParams(initialOutputs) {
    return __awaiter(this, void 0, void 0, function* () {
        const amountToSend = (0, array_helpers_1.sumItemValues)(initialOutputs, "value");
        console.log("amount to send.........", amountToSend);
        const txnParams = { inputs: [], outputs: [] };
        const { inputsToUse, totalAmount } = yield getInputsForAmount(amountToSend);
        console.log("Number of inputs to use....", inputsToUse.length);
        console.log("Amount available....", totalAmount);
        if ((inputsToUse.length <= 0) || (totalAmount < amountToSend)) {
            throw new InsufficientInputs_1.default(wallet_errors_1.walletErrors.insufficientBalance);
        }
        else {
            let txnFees = yield calculateTransactionFees(inputsToUse.length, initialOutputs.length);
            let amountToSendInSats = (0, conversions_1.btcToSatoshi)(amountToSend);
            let totalAmountInSats = (0, conversions_1.btcToSatoshi)(totalAmount);
            let finalOutputs = (0, conversions_1.convertItemsToSatoshi)(initialOutputs, "value");
            let finalInputs = (0, conversions_1.convertItemsToSatoshi)(inputsToUse, "value");
            let remainder = totalAmountInSats - amountToSendInSats;
            if (remainder > 0) {
                txnFees = yield calculateTransactionFees(inputsToUse.length, finalOutputs.length + 1);
                finalOutputs = deductFeeFromOutputs(finalOutputs, txnFees);
                finalOutputs.push({
                    address: settings_1.VAULT_ADDRESS,
                    value: remainder
                });
            }
            else {
                finalOutputs = deductFeeFromOutputs(finalOutputs, txnFees);
            }
            txnParams.inputs = finalInputs;
            txnParams.outputs = finalOutputs;
            txnParams.transactionFee = txnFees;
        }
        return txnParams;
    });
}
exports.prepareTxnParams = prepareTxnParams;
function getInputsForAmount(amount) {
    return __awaiter(this, void 0, void 0, function* () {
        const inputsToUse = [];
        let inputAmount = 0;
        const txnRepo = dataSource_1.default.getRepository(TxnInput_1.default);
        const txnInputs = yield txnRepo.find({ where: { spent: false }, order: { id: "ASC" } });
        if (txnInputs.length > 0) {
            const inputsLen = txnInputs.length;
            for (let i = 0; i < inputsLen; i++) {
                if (inputAmount < amount) {
                    let currentInput = txnInputs[i];
                    inputsToUse.push(currentInput);
                    inputAmount += currentInput.value;
                }
                else {
                    break;
                }
            }
        }
        return {
            inputsToUse,
            totalAmount: inputAmount
        };
    });
}
exports.getInputsForAmount = getInputsForAmount;
function calculateTransactionFees(inputCount, outputCount) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const vBytes = Math.ceil((42 + (272 * inputCount) + (128 * outputCount)) / 4);
        const txnService = new TransactionService_1.default();
        const densityObject = yield txnService.getFeeDensity();
        const feerate = (_a = densityObject === null || densityObject === void 0 ? void 0 : densityObject.medium_fee_per_kb) !== null && _a !== void 0 ? _a : 6000;
        const satsPerByte = feerate / 1000;
        return satsPerByte * vBytes;
    });
}
exports.calculateTransactionFees = calculateTransactionFees;
function deductFeeFromOutputs(outputs, fee) {
    const outputLen = outputs.length;
    const divPercentage = 100 / outputLen;
    const amountToDeduct = Math.ceil((divPercentage / 100) * fee);
    const newOutputs = outputs.map((output) => {
        return Object.assign(Object.assign({}, output), { value: output.value - amountToDeduct });
    });
    return newOutputs;
}
exports.deductFeeFromOutputs = deductFeeFromOutputs;
function validateInputSignatures(pubkey, msghash, signature) {
    const ecpair = (new AddressServices_1.default()).getEcpair();
    return ecpair.fromPublicKey(pubkey).verify(msghash, signature);
}
exports.validateInputSignatures = validateInputSignatures;
function recordSentTransaction(txId, inputsUsed) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield dataSource_1.default.transaction((entityManager) => __awaiter(this, void 0, void 0, function* () {
            const spentInputRepo = entityManager.getRepository(SpentInput_1.default);
            const sentTxnRepo = entityManager.getRepository(SentTransaction_1.default);
            const txnInputRepo = entityManager.getRepository(TxnInput_1.default);
            const updatedInputs = [];
            const spentInputs = [];
            const newSentTxn = new SentTransaction_1.default();
            newSentTxn.txId = txId;
            const savedSentTxn = yield sentTxnRepo.save(newSentTxn);
            inputsUsed.forEach((input) => {
                input.spent = true;
                updatedInputs.push(input);
                const newSpentInput = new SpentInput_1.default();
                newSpentInput.inputId = input.id;
                newSpentInput.txId = savedSentTxn.id;
                spentInputs.push(newSpentInput);
            });
            yield spentInputRepo.save(spentInputs);
            yield txnInputRepo.save(updatedInputs);
            return;
        }));
    });
}
exports.recordSentTransaction = recordSentTransaction;
