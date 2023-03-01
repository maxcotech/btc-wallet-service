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
exports.AccountRecordTypes = void 0;
const typeorm_1 = require("typeorm");
var AccountRecordTypes;
(function (AccountRecordTypes) {
    AccountRecordTypes["CREDIT"] = "credit";
    AccountRecordTypes["DEBIT"] = "debit";
})(AccountRecordTypes = exports.AccountRecordTypes || (exports.AccountRecordTypes = {}));
let AccountRecord = class AccountRecord {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], AccountRecord.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 1000 }),
    __metadata("design:type", Number)
], AccountRecord.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "double" }),
    __metadata("design:type", Number)
], AccountRecord.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: AccountRecordTypes }),
    __metadata("design:type", String)
], AccountRecord.prototype, "ledgerType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp", nullable: true, default: () => "CURRENT_TIMESTAMP" }),
    __metadata("design:type", String)
], AccountRecord.prototype, "createdAt", void 0);
AccountRecord = __decorate([
    (0, typeorm_1.Entity)({ name: "account_records" })
], AccountRecord);
exports.default = AccountRecord;
