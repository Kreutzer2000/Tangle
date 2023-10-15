"use strict";
// Copyright 2023 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaggedDataPayload = void 0;
const payload_1 = require("../payload");
/**
 * A Tagged Data payload.
 */
class TaggedDataPayload extends payload_1.Payload {
    /**
     * @param tag A tag as hex-encoded string.
     * @param data Index data as hex-encoded string.
     */
    constructor(tag, data) {
        super(payload_1.PayloadType.TaggedData);
        this.tag = tag;
        this.data = data;
    }
}
exports.TaggedDataPayload = TaggedDataPayload;
//# sourceMappingURL=tagged.js.map