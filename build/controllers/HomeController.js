"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Controller_1 = __importDefault(require("./Controller"));
class HomeController extends Controller_1.default {
    static index(req, res) {
        res.send({
            hello: "Welcome to Btc Wallet",
            baseUrl: req.baseUrl,
        });
    }
}
exports.default = HomeController;
