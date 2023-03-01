"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.successWithData = void 0;
function successWithData(data, res) {
    return res.status(200).json({
        success: true,
        data
    });
}
exports.successWithData = successWithData;
