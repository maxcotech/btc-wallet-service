"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sumItemValues = void 0;
function sumItemValues(items, property) {
    let sum = 0;
    items.forEach((item) => {
        let val = item[property];
        if (typeof val === "number") {
            sum += val;
        }
    });
    return sum;
}
exports.sumItemValues = sumItemValues;
