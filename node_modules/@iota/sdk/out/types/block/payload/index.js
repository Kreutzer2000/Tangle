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
exports.parsePayload = exports.PayloadDiscriminator = void 0;
const class_transformer_1 = require("class-transformer");
const milestone_1 = require("./milestone");
const payload_1 = require("./payload");
const tagged_1 = require("./tagged");
const transaction_1 = require("./transaction");
const treasury_1 = require("./treasury");
__exportStar(require("./milestone"), exports);
__exportStar(require("./tagged"), exports);
__exportStar(require("./transaction"), exports);
__exportStar(require("./payload"), exports);
exports.PayloadDiscriminator = {
    property: 'type',
    subTypes: [
        { value: milestone_1.MilestonePayload, name: payload_1.PayloadType.Milestone },
        { value: tagged_1.TaggedDataPayload, name: payload_1.PayloadType.TaggedData },
        { value: transaction_1.TransactionPayload, name: payload_1.PayloadType.Transaction },
        {
            value: treasury_1.TreasuryTransactionPayload,
            name: payload_1.PayloadType.TreasuryTransaction,
        },
    ],
};
function parsePayload(data) {
    if (data.type == payload_1.PayloadType.Milestone) {
        return (0, class_transformer_1.plainToInstance)(milestone_1.MilestonePayload, data);
    }
    else if (data.type == payload_1.PayloadType.TaggedData) {
        return (0, class_transformer_1.plainToInstance)(tagged_1.TaggedDataPayload, data);
    }
    else if (data.type == payload_1.PayloadType.Transaction) {
        return (0, class_transformer_1.plainToInstance)(transaction_1.TransactionPayload, data);
    }
    else if (data.type == payload_1.PayloadType.TreasuryTransaction) {
        return (0, class_transformer_1.plainToInstance)(treasury_1.TreasuryTransactionPayload, data);
    }
    throw new Error('Invalid JSON');
}
exports.parsePayload = parsePayload;
//# sourceMappingURL=index.js.map