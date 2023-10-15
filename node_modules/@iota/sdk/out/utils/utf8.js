"use strict";
// Copyright 2023 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.utf8ToHex = exports.hexToUtf8 = exports.utf8ToBytes = void 0;
/** Convert UTF8 string to an array of bytes */
const utf8ToBytes = (utf8) => {
    const utf8Encode = new TextEncoder();
    return Array.from(utf8Encode.encode(utf8));
};
exports.utf8ToBytes = utf8ToBytes;
/** Convert hex encoded string to UTF8 string */
const hexToUtf8 = (hex) => decodeURIComponent(hex.replace(/^0x/, '').replace(/[0-9a-f]{2}/g, '%$&'));
exports.hexToUtf8 = hexToUtf8;
/** Convert UTF8 string to hex encoded string */
const utf8ToHex = (utf8) => '0x' + Buffer.from(utf8, 'utf8').toString('hex');
exports.utf8ToHex = utf8ToHex;
//# sourceMappingURL=utf8.js.map