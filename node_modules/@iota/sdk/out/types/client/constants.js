"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoinType = exports.SHIMMER_TESTNET_BECH32_HRP = exports.SHIMMER_BECH32_HRP = exports.IOTA_TESTNET_BECH32_HRP = exports.IOTA_BECH32_HRP = void 0;
// Copyright 2023 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0
exports.IOTA_BECH32_HRP = 'iota';
exports.IOTA_TESTNET_BECH32_HRP = 'atoi';
exports.SHIMMER_BECH32_HRP = 'smr';
exports.SHIMMER_TESTNET_BECH32_HRP = 'rms';
/** BIP44 Coin Types for IOTA and Shimmer. */
var CoinType;
(function (CoinType) {
    /** The IOTA coin. */
    CoinType[CoinType["IOTA"] = 4218] = "IOTA";
    /** The Shimmer coin. */
    CoinType[CoinType["Shimmer"] = 4219] = "Shimmer";
    /** The Ether coin. */
    CoinType[CoinType["Ether"] = 60] = "Ether";
})(CoinType = exports.CoinType || (exports.CoinType = {}));
//# sourceMappingURL=constants.js.map