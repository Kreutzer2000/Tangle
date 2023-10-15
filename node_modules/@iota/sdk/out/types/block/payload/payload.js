"use strict";
// Copyright 2023 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payload = exports.PayloadType = void 0;
/**
 * All of the block payload types.
 */
var PayloadType;
(function (PayloadType) {
    /** A milestone payload. */
    PayloadType[PayloadType["Milestone"] = 7] = "Milestone";
    /** A tagged data payload. */
    PayloadType[PayloadType["TaggedData"] = 5] = "TaggedData";
    /** A transaction payload. */
    PayloadType[PayloadType["Transaction"] = 6] = "Transaction";
    /** A treasury transaction payload. */
    PayloadType[PayloadType["TreasuryTransaction"] = 4] = "TreasuryTransaction";
})(PayloadType || (PayloadType = {}));
exports.PayloadType = PayloadType;
/**
 * The base class for block payloads.
 */
class Payload {
    /**
     * @param type The type of payload.
     */
    constructor(type) {
        this.type = type;
    }
    /**
     * Get the type of payload.
     */
    getType() {
        return this.type;
    }
}
exports.Payload = Payload;
//# sourceMappingURL=payload.js.map