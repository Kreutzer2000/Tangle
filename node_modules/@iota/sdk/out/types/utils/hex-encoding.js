"use strict";
// Copyright 2023 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.hexToBigInt = exports.bigIntToHex = void 0;
/**
 * Converts `bigint` value to hexadecimal string representation prefixed with "0x".
 */
function bigIntToHex(value) {
    return '0x' + value.toString(16);
}
exports.bigIntToHex = bigIntToHex;
/**
 * Converts hex encoded string to `bigint` value.
 */
function hexToBigInt(value) {
    if (!value.startsWith('0x')) {
        value = '0x' + value;
    }
    return BigInt(value);
}
exports.hexToBigInt = hexToBigInt;
//# sourceMappingURL=hex-encoding.js.map