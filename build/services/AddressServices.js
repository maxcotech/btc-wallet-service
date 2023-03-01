"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ecpair_1 = __importDefault(require("ecpair"));
const Service_1 = __importDefault(require("./Service"));
const ecc = __importStar(require("tiny-secp256k1"));
const bitcoin = __importStar(require("bitcoinjs-lib"));
const crypto_js_1 = __importDefault(require("crypto-js"));
const settings_1 = require("../config/settings");
class AddressServices extends Service_1.default {
    getEcpair() {
        const ecpair = (0, ecpair_1.default)(ecc);
        return ecpair;
    }
    generateSegwitAddress() {
        var _a, _b, _c, _d;
        const ecpair = this.getEcpair();
        const keypair = ecpair.makeRandom();
        const payment = bitcoin.payments.p2wpkh({ pubkey: keypair.publicKey, network: this.network });
        const pubKey = (_a = payment.pubkey) === null || _a === void 0 ? void 0 : _a.toString("hex");
        const address = payment.address;
        const signature = (_b = payment.signature) === null || _b === void 0 ? void 0 : _b.toString("hex");
        const hash = (_c = payment.hash) === null || _c === void 0 ? void 0 : _c.toString("hex");
        const output = (_d = payment.output) === null || _d === void 0 ? void 0 : _d.toString("hex");
        const wifCrypt = crypto_js_1.default.AES.encrypt(keypair.toWIF(), settings_1.ENCRYPTION_SALT !== null && settings_1.ENCRYPTION_SALT !== void 0 ? settings_1.ENCRYPTION_SALT : "").toString();
        return { pubKey, address, signature, hash, output, wifCrypt };
    }
}
exports.default = AddressServices;
