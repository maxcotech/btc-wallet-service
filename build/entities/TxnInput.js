"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
let TxnInput = class TxnInput {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], TxnInput.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 2000, type: "varchar" }),
    __metadata("design:type", String)
], TxnInput.prototype, "txId", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 1000 }),
    __metadata("design:type", String)
], TxnInput.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 8000, type: "varchar" }),
    __metadata("design:type", String)
], TxnInput.prototype, "txnHash", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], TxnInput.prototype, "vout", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "double" }),
    __metadata("design:type", Number)
], TxnInput.prototype, "value", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "bool", default: false }),
    __metadata("design:type", Boolean)
], TxnInput.prototype, "received", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "bool", default: false }),
    __metadata("design:type", Boolean)
], TxnInput.prototype, "spent", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: "varchar", length: 2000 }),
    __metadata("design:type", String)
], TxnInput.prototype, "scriptPubKey", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: "varchar", length: 2000 }),
    __metadata("design:type", String)
], TxnInput.prototype, "redeemScript", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: "timestamp", default: () => "CURRENT_TIMESTAMP" }),
    __metadata("design:type", String)
], TxnInput.prototype, "createdAt", void 0);
TxnInput = __decorate([
    (0, typeorm_1.Entity)({ name: "txn_inputs" })
], TxnInput);
exports.default = TxnInput;
