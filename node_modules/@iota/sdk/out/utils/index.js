"use strict";
// Copyright 2023 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0
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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hexToBytes = exports.bytesToHex = void 0;
__exportStar(require("./utf8"), exports);
__exportStar(require("./utils"), exports);
__exportStar(require("../types/utils"), exports);
/**
 * Converts a byte array to a hexadecimal string.
 *
 * @param {Uint8Array} byteArray - The bytes to encode.
 * @param {boolean} [prefix=false] - Whether to include the '0x' prefix in the resulting hexadecimal string.
 * @returns {string} The hexadecimal representation of the input byte array.
 */
const bytesToHex = (bytes, prefix = false) => {
    const hexArray = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0'));
    const hexString = hexArray.join('');
    return prefix ? '0x' + hexString : hexString;
};
exports.bytesToHex = bytesToHex;
/**
 * Converts a hexadecimal string to a Uint8Array byte array.
 *
 * @param {string} hexString - The hexadecimal string to be converted.
 * @returns {Uint8Array} The Uint8Array byte array representation of the input hexadecimal string.
 * @throws {Error} Will throw an error if the input string is not a valid hexadecimal string.
 */
const hexToBytes = (hexString) => {
    const hex = hexString.replace(/^0x/, '');
    const bytes = [];
    for (let i = 0; i < hex.length; i += 2) {
        bytes.push(parseInt(hex.substr(i, 2), 16));
    }
    return new Uint8Array(bytes);
};
exports.hexToBytes = hexToBytes;
//# sourceMappingURL=index.js.map