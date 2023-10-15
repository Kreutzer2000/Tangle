"use strict";
// Copyright 2023 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleTokenScheme = exports.TokenSchemeType = exports.TokenScheme = exports.TokenSchemeDiscriminator = void 0;
const hex_encoding_1 = require("../../utils/hex-encoding");
/**
 * All of the token scheme types.
 */
var TokenSchemeType;
(function (TokenSchemeType) {
    /** A simple token scheme. */
    TokenSchemeType[TokenSchemeType["Simple"] = 0] = "Simple";
})(TokenSchemeType || (TokenSchemeType = {}));
exports.TokenSchemeType = TokenSchemeType;
/**
 * The base class for token schemes.
 */
class TokenScheme {
    /**
     * @param type The type of token scheme.
     */
    constructor(type) {
        this.type = type;
    }
    /**
     * Get the type of token scheme.
     */
    getType() {
        return this.type;
    }
}
exports.TokenScheme = TokenScheme;
/**
 * A simple token scheme.
 */
class SimpleTokenScheme extends TokenScheme {
    /**
     * @param mintedTokens The number of tokens that were minted.
     * @param meltedTokens The number of tokens that were melted.
     * @param maximumSupply The maximum supply of the token.
     */
    constructor(mintedTokens, meltedTokens, maximumSupply) {
        super(TokenSchemeType.Simple);
        if (typeof mintedTokens === 'bigint') {
            this.mintedTokens = mintedTokens;
        }
        else if (mintedTokens) {
            this.mintedTokens = (0, hex_encoding_1.hexToBigInt)(mintedTokens);
        }
        else {
            this.mintedTokens = BigInt(0);
        }
        if (typeof meltedTokens === 'bigint') {
            this.meltedTokens = meltedTokens;
        }
        else if (meltedTokens) {
            this.meltedTokens = (0, hex_encoding_1.hexToBigInt)(meltedTokens);
        }
        else {
            this.meltedTokens = BigInt(0);
        }
        if (typeof maximumSupply === 'bigint') {
            this.maximumSupply = maximumSupply;
        }
        else if (maximumSupply) {
            this.maximumSupply = (0, hex_encoding_1.hexToBigInt)(maximumSupply);
        }
        else {
            this.maximumSupply = BigInt(0);
        }
    }
    /**
     * Get the amount of tokens minted.
     */
    getMintedTokens() {
        return this.mintedTokens;
    }
    /**
     * Get the amount of tokens melted.
     */
    getMeltedTokens() {
        return this.meltedTokens;
    }
    /**
     * Get the maximum supply of tokens.
     */
    getMaximumSupply() {
        return this.maximumSupply;
    }
}
exports.SimpleTokenScheme = SimpleTokenScheme;
const TokenSchemeDiscriminator = {
    property: 'type',
    subTypes: [
        { value: SimpleTokenScheme, name: TokenSchemeType.Simple },
    ],
};
exports.TokenSchemeDiscriminator = TokenSchemeDiscriminator;
//# sourceMappingURL=token-scheme.js.map