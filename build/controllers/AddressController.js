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
const Controller_1 = __importDefault(require("./Controller"));
const AddressServices_1 = __importDefault(require("./../services/AddressServices"));
const Address_1 = __importDefault(require("../entities/Address"));
const dataSource_1 = __importDefault(require("./../config/dataSource"));
const AppException_1 = __importDefault(require("../exceptions/AppException"));
const wallet_errors_1 = require("../config/errors/wallet.errors");
class AddressController extends Controller_1.default {
    static createAddress({ req, res }) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            const service = new AddressServices_1.default();
            const addressPayload = service.generateSegwitAddress();
            if (addressPayload.address !== undefined) {
                const addressModel = new Address_1.default();
                addressModel.address = addressPayload.address;
                addressModel.hash = (_a = addressPayload.hash) !== null && _a !== void 0 ? _a : "";
                addressModel.pubKey = (_b = addressPayload.pubKey) !== null && _b !== void 0 ? _b : "";
                addressModel.userId = req.body.userId;
                addressModel.witness = (_c = addressPayload.output) !== null && _c !== void 0 ? _c : "";
                addressModel.wifCrypt = addressPayload.wifCrypt;
                const addressRepo = dataSource_1.default.getRepository(Address_1.default);
                const saved = yield addressRepo.save(addressModel);
                return saved;
            }
            else {
                throw new AppException_1.default(wallet_errors_1.walletErrors.failedToCreateAddress);
            }
        });
    }
}
exports.default = AddressController;
