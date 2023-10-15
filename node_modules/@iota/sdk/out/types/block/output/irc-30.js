"use strict";
// Copyright 2023 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.Irc30Metadata = void 0;
const utf8_1 = require("../../../utils/utf8");
const feature_1 = require("./feature");
/**
 * The IRC30 native token metadata standard schema.
 */
class Irc30Metadata {
    /**
     * @param name The human-readable name of the native token.
     * @param symbol The symbol/ticker of the token.
     * @param decimals Number of decimals the token uses.
     */
    constructor(name, symbol, decimals) {
        /** The IRC standard */
        this.standard = 'IRC30';
        this.name = name;
        this.symbol = symbol;
        this.decimals = decimals;
    }
    withDescription(description) {
        this.description = description;
        return this;
    }
    withUrl(url) {
        this.url = url;
        return this;
    }
    withLogoUrl(logoUrl) {
        this.logoUrl = logoUrl;
        return this;
    }
    withLogo(logo) {
        this.logo = logo;
        return this;
    }
    asHex() {
        return (0, utf8_1.utf8ToHex)(JSON.stringify(this));
    }
    asFeature() {
        return new feature_1.MetadataFeature(this.asHex());
    }
}
exports.Irc30Metadata = Irc30Metadata;
//# sourceMappingURL=irc-30.js.map