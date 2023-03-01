"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AppException extends Error {
    constructor(msg, code = 500) {
        super(msg);
        this.errorCode = 500;
        this.errorCode = code;
        // Set the prototype explicitly.
        Object.setPrototypeOf(this, AppException.prototype);
    }
    getErrorCode() {
        return this.errorCode;
    }
}
exports.default = AppException;
