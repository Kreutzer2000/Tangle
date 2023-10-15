"use strict";
// Copyright 2023 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.NftAddress = exports.AliasAddress = exports.Ed25519Address = exports.AddressType = exports.Address = exports.AddressDiscriminator = void 0;
const class_transformer_1 = require("class-transformer");
/**
 * Address type variants.
 */
var AddressType;
(function (AddressType) {
    /** An Ed25519 address. */
    AddressType[AddressType["Ed25519"] = 0] = "Ed25519";
    /** An Alias address. */
    AddressType[AddressType["Alias"] = 8] = "Alias";
    /** An NFT address. */
    AddressType[AddressType["Nft"] = 16] = "Nft";
})(AddressType || (AddressType = {}));
exports.AddressType = AddressType;
/**
 * The base class for addresses.
 */
class Address {
    /**
     * @param type The type of the address.
     */
    constructor(type) {
        this.type = type;
    }
    /**
     * Get the type of address.
     */
    getType() {
        return this.type;
    }
    /**
     * Parse an address from a JSON string.
     */
    static parse(data) {
        if (data.type == AddressType.Ed25519) {
            return (0, class_transformer_1.plainToInstance)(Ed25519Address, data);
        }
        else if (data.type == AddressType.Alias) {
            return (0, class_transformer_1.plainToInstance)(AliasAddress, data);
        }
        else if (data.type == AddressType.Nft) {
            return (0, class_transformer_1.plainToInstance)(NftAddress, data);
        }
        throw new Error('Invalid JSON');
    }
}
exports.Address = Address;
/**
 * An Ed25519 Address.
 */
class Ed25519Address extends Address {
    /**
     * @param address An Ed25519 address as hex-encoded string.
     */
    constructor(address) {
        super(AddressType.Ed25519);
        this.pubKeyHash = address;
    }
    /**
     * Get the public key hash.
     */
    getPubKeyHash() {
        return this.pubKeyHash;
    }
    toString() {
        return this.getPubKeyHash();
    }
}
exports.Ed25519Address = Ed25519Address;
/**
 * An Alias address.
 */
class AliasAddress extends Address {
    /**
     * @param address An Alias address as Alias ID.
     */
    constructor(address) {
        super(AddressType.Alias);
        this.aliasId = address;
    }
    /**
     * Get the alias ID.
     */
    getAliasId() {
        return this.aliasId;
    }
    toString() {
        return this.getAliasId();
    }
}
exports.AliasAddress = AliasAddress;
/**
 * An NFT address.
 */
class NftAddress extends Address {
    /**
     * @param address An NFT address as NFT ID.
     */
    constructor(address) {
        super(AddressType.Nft);
        this.nftId = address;
    }
    /**
     * Get the NFT ID.
     */
    getNftId() {
        return this.nftId;
    }
    toString() {
        return this.getNftId();
    }
}
exports.NftAddress = NftAddress;
const AddressDiscriminator = {
    property: 'type',
    subTypes: [
        { value: Ed25519Address, name: AddressType.Ed25519 },
        { value: AliasAddress, name: AddressType.Alias },
        { value: NftAddress, name: AddressType.Nft },
    ],
};
exports.AddressDiscriminator = AddressDiscriminator;
//# sourceMappingURL=address.js.map