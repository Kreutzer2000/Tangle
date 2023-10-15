"use strict";
// Copyright 2023 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.Signature = exports.Ed25519Signature = exports.SignatureType = void 0;
/**
 * All of the signature types.
 */
var SignatureType;
(function (SignatureType) {
    /**
     * An Ed25519 signature.
     */
    SignatureType[SignatureType["Ed25519"] = 0] = "Ed25519";
})(SignatureType || (SignatureType = {}));
exports.SignatureType = SignatureType;
/**
 * The base class for signatures.
 */
class Signature {
    /**
     * @param type The type of signature.
     */
    constructor(type) {
        this.type = type;
    }
    /**
     * Get the type of signature.
     */
    getType() {
        return this.type;
    }
}
exports.Signature = Signature;
/**
 * An Ed25519 signature.
 */
class Ed25519Signature extends Signature {
    /**
     * @param publicKey A Ed25519 public key as hex-encoded string.
     * @param signature A Ed25519 signature as hex-encoded string.
     */
    constructor(publicKey, signature) {
        super(SignatureType.Ed25519);
        this.publicKey = publicKey;
        this.signature = signature;
    }
}
exports.Ed25519Signature = Ed25519Signature;
//# sourceMappingURL=signature.js.map