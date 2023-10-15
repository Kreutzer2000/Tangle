"use strict";
// Copyright 2023 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.MilestoneOption = exports.MilestoneOptionType = void 0;
/**
 * All of the milestone option types.
 */
var MilestoneOptionType;
(function (MilestoneOptionType) {
    /** The Receipt milestone option. */
    MilestoneOptionType[MilestoneOptionType["Receipt"] = 0] = "Receipt";
    /** The ProtocolParams milestone option. */
    MilestoneOptionType[MilestoneOptionType["ProtocolParams"] = 1] = "ProtocolParams";
})(MilestoneOptionType || (MilestoneOptionType = {}));
exports.MilestoneOptionType = MilestoneOptionType;
class MilestoneOption {
    /**
     * @param type The type of milestone option.
     */
    constructor(type) {
        this.type = type;
    }
    /**
     * Get the type of milestone option.
     */
    getType() {
        return this.type;
    }
}
exports.MilestoneOption = MilestoneOption;
//# sourceMappingURL=milestone-options.js.map