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
let Address = class Address {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Address.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true, length: 1000, type: "varchar" }),
    __metadata("design:type", String)
], Address.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 1000, type: "varchar" }),
    __metadata("design:type", String)
], Address.prototype, "hash", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 1000 }),
    __metadata("design:type", String)
], Address.prototype, "pubKey", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 2000 }),
    __metadata("design:type", String)
], Address.prototype, "wifCrypt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 1000 }),
    __metadata("design:type", String)
], Address.prototype, "witness", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 1000, nullable: true }),
    __metadata("design:type", String)
], Address.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp", nullable: true, default: () => "CURRENT_TIMESTAMP" }),
    __metadata("design:type", String)
], Address.prototype, "createdAt", void 0);
Address = __decorate([
    (0, typeorm_1.Entity)({ name: "addresses" })
], Address);
exports.default = Address;
