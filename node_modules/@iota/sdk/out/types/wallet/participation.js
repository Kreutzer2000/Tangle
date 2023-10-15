"use strict";
// Copyright 2023 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParticipationEventType = exports.EventStatus = void 0;
/**
 * All possible event status.
 */
var EventStatus;
(function (EventStatus) {
    EventStatus["Upcoming"] = "upcoming";
    EventStatus["Commencing"] = "commencing";
    EventStatus["Holding"] = "holding";
    EventStatus["Ended"] = "ended";
})(EventStatus = exports.EventStatus || (exports.EventStatus = {}));
/**
 * The types of participation events.
 */
var ParticipationEventType;
(function (ParticipationEventType) {
    /** A voting event. */
    ParticipationEventType[ParticipationEventType["Voting"] = 0] = "Voting";
    /** A staking event. */
    ParticipationEventType[ParticipationEventType["Staking"] = 1] = "Staking";
})(ParticipationEventType = exports.ParticipationEventType || (exports.ParticipationEventType = {}));
//# sourceMappingURL=participation.js.map