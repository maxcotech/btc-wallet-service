"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppException_1 = __importDefault(require("./AppException"));
class InsufficientInputs extends AppException_1.default {
    constructor(msg, code = 422) {
        super(msg, code);
    }
}
exports.default = InsufficientInputs;
