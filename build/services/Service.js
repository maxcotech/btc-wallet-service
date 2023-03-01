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
const axios_1 = __importDefault(require("axios"));
const bitcoin = __importStar(require("bitcoinjs-lib"));
const appConstants_1 = require("../config/appConstants");
const settings_1 = require("../config/settings");
const auth_helpers_1 = require("../helpers/auth_helpers");
class Service {
    constructor() {
        this.network = bitcoin.networks.testnet;
        this.baseUrl = settings_1.NODE_BASE_URL;
        this.feeDensityUrl = "https://api.blockcypher.com/v1/btc/main";
        this.client = this.getClient();
    }
    getAppClient() {
        const client = axios_1.default.create({ baseURL: settings_1.APP_API_URL });
        client.interceptors.request.use((configs) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (configs !== undefined && configs.headers !== undefined) {
                configs.headers.accept = "application/json";
                configs.headers[appConstants_1.AUTH_HEADER_KEY] = (_a = yield (0, auth_helpers_1.getClientSecret)()) !== null && _a !== void 0 ? _a : "";
            }
            return configs;
        }));
        client.interceptors.response.use(function (response) {
            return response;
        }, function (error) {
            console.log(error);
            return Promise.reject(error);
        });
        return client;
    }
    getClient() {
        const client = axios_1.default.create({ baseURL: this.baseUrl });
        client.interceptors.request.use((configs) => {
            if (configs !== undefined && configs.headers !== undefined) {
                configs.headers.accept = "application/json";
                configs.headers['x-api-key'] = settings_1.GB_API_KEY !== null && settings_1.GB_API_KEY !== void 0 ? settings_1.GB_API_KEY : "";
                configs.headers['Content-Type'] = "text/plain";
            }
            return configs;
        });
        client.interceptors.response.use(function (response) {
            return response;
        }, function (error) {
            console.log(error);
            return Promise.reject(error);
        });
        return client;
    }
    getConnection() {
        return this;
    }
    getSingleParamReqBody(param, method, id = "servicecall") {
        return {
            id,
            jsonrpc: this.jsonrpcVersion,
            method,
            params: [param]
        };
    }
    getRequest(method, params = [], id = "servicecall") {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.client.post("", JSON.stringify({
                id,
                jsonrpc: this.jsonrpcVersion,
                method,
                params
            }), {
                maxContentLength: Infinity,
                maxBodyLength: Infinity,
                timeoutErrorMessage: "Could not complete this request on time ",
            });
        });
    }
}
exports.default = Service;
