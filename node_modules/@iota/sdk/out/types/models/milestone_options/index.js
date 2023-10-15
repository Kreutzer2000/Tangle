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
exports.MilestoneOptionDiscriminator = void 0;
const milestone_options_1 = require("./milestone-options");
const protocol_params_milestone_option_1 = require("./protocol-params-milestone-option");
const receipt_milestone_option_1 = require("./receipt-milestone-option");
__exportStar(require("./protocol-params-milestone-option"), exports);
__exportStar(require("./receipt-milestone-option"), exports);
__exportStar(require("./milestone-options"), exports);
exports.MilestoneOptionDiscriminator = {
    property: 'type',
    subTypes: [
        {
            value: receipt_milestone_option_1.ReceiptMilestoneOption,
            name: milestone_options_1.MilestoneOptionType.Receipt,
        },
        {
            value: protocol_params_milestone_option_1.ProtocolParamsMilestoneOption,
            name: milestone_options_1.MilestoneOptionType.ProtocolParams,
        },
    ],
};
//# sourceMappingURL=index.js.map