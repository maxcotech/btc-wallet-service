"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const conversions_1 = require("./conversions");
describe("Conversions Module", () => {
    test("2 btc is 20000000 in satoshi", () => {
        expect((0, conversions_1.btcToSatoshi)(2)).toBe(20000000);
    });
});
