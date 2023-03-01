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
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertItemsToSatoshi = exports.btcToSatoshi = void 0;
const sb = __importStar(require("satoshi-bitcoin-ts"));
const btcToSatoshi = (btc) => {
    return sb.toSatoshi(btc);
};
exports.btcToSatoshi = btcToSatoshi;
/*
    T = type of array items;
    B = transformer parameter type;
    C = transformer return type;
*/
function convertItemsToSatoshi(items, property) {
    const newItems = items.map((item) => {
        if (typeof item[property] === "number") {
            //@ts-ignore
            item[property] = (0, exports.btcToSatoshi)(item[property]);
        }
        return item;
    });
    return newItems;
}
exports.convertItemsToSatoshi = convertItemsToSatoshi;
