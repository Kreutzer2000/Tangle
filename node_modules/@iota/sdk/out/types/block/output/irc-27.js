"use strict";
// Copyright 2023 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.Attribute = exports.Irc27Metadata = void 0;
const utf8_1 = require("../../../utils/utf8");
const feature_1 = require("./feature");
/**
 * The IRC27 NFT standard schema.
 */
class Irc27Metadata {
    /**
     * @param type The media type (MIME) of the asset.
     * @param uri URL pointing to the NFT file location.
     * @param name The human-readable name of the native token.
     */
    constructor(type, uri, name) {
        /** The IRC standard */
        this.standard = 'IRC27';
        /** The current version. */
        this.version = 'v1.0';
        /** Royalty payment addresses mapped to the payout percentage. */
        this.royalties = new Map();
        /** Additional attributes which follow [OpenSea Metadata standards](https://docs.opensea.io/docs/metadata-standards). */
        this.attributes = [];
        this.type = type;
        this.uri = uri;
        this.name = name;
    }
    withCollectionName(collectionName) {
        this.collectionName = collectionName;
        return this;
    }
    addRoyalty(address, percentage) {
        this.royalties.set(address, percentage);
        return this;
    }
    withRoyalties(royalties) {
        this.royalties = royalties;
        return this;
    }
    withIssuerName(issuerName) {
        this.issuerName = issuerName;
        return this;
    }
    withDescription(description) {
        this.description = description;
        return this;
    }
    addAttribute(attribute) {
        this.attributes.push(attribute);
        return this;
    }
    withAttributes(attributes) {
        this.attributes = attributes;
        return this;
    }
    asHex() {
        return (0, utf8_1.utf8ToHex)(JSON.stringify(this));
    }
    asFeature() {
        return new feature_1.MetadataFeature(this.asHex());
    }
}
exports.Irc27Metadata = Irc27Metadata;
class Attribute {
    constructor(trait_type, value) {
        this.trait_type = trait_type;
        this.value = value;
    }
    withDisplayType(display_type) {
        this.display_type = display_type;
        return this;
    }
}
exports.Attribute = Attribute;
//# sourceMappingURL=irc-27.js.map