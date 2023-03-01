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
exports.getClientSecret = exports.requireAuthKey = void 0;
const general_errors_1 = require("./../config/errors/general.errors");
const appConstants_1 = require("../config/appConstants");
const settings_1 = require("../config/settings");
const responseTypes_1 = require("../config/responseTypes");
const AppException_1 = __importDefault(require("./../exceptions/AppException"));
function requireAuthKey(controller) {
    return __awaiter(this, void 0, void 0, function* () {
        return (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const clientAuth = req.headers[appConstants_1.AUTH_HEADER_KEY];
                if (clientAuth && authKeyIsValid(clientAuth)) {
                    const data = yield controller({ req, res });
                    return (0, responseTypes_1.successWithData)(data, res);
                }
                return res.status(401).json({
                    success: false,
                    message: general_errors_1.generalErrors.notAuthorized
                });
            }
            catch (e) {
                if (e instanceof AppException_1.default) {
                    res.status(e.errorCode).json({
                        success: false,
                        message: (_a = e.message) !== null && _a !== void 0 ? _a : general_errors_1.generalErrors.internalServerError
                    });
                }
                else {
                    console.log(e);
                }
                return false;
            }
        });
    });
}
exports.requireAuthKey = requireAuthKey;
function authKeyIsValid(authKey) {
    return (authKey === settings_1.CLIENT_AUTH);
}
function getClientSecret() {
    return __awaiter(this, void 0, void 0, function* () {
        return settings_1.CLIENT_AUTH;
    });
}
exports.getClientSecret = getClientSecret;
