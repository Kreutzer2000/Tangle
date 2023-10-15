"use strict";
// Copyright 2023 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProtocolParamsMilestoneOption = void 0;
const milestone_options_1 = require("./milestone-options");
/**
 * A Protocol Parameters Milestone Option.
 */
class ProtocolParamsMilestoneOption extends milestone_options_1.MilestoneOption {
    /**
     * @param targetMilestoneIndex The milestone index at which these protocol parameters become active.
     * @param protocolVersion The to be applied protocol version.
     * @param params The protocol parameters in binary form. Hex-encoded with 0x prefix.
     */
    constructor(targetMilestoneIndex, protocolVersion, params) {
        super(milestone_options_1.MilestoneOptionType.Receipt);
        this.targetMilestoneIndex = targetMilestoneIndex;
        this.protocolVersion = protocolVersion;
        this.params = params;
    }
}
exports.ProtocolParamsMilestoneOption = ProtocolParamsMilestoneOption;
//# sourceMappingURL=protocol-params-milestone-option.js.map