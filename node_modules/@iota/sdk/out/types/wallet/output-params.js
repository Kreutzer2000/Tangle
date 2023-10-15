"use strict";
// Copyright 2021-2023 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReturnStrategy = void 0;
/** Return strategy for the storage deposit. */
var ReturnStrategy;
(function (ReturnStrategy) {
    /** A storage deposit return unlock condition will be added with the required minimum storage deposit. */
    ReturnStrategy["Return"] = "Return";
    /** The recipient address will get the additional amount to reach the minimum storage deposit gifted. */
    ReturnStrategy["Gift"] = "Gift";
})(ReturnStrategy = exports.ReturnStrategy || (exports.ReturnStrategy = {}));
//# sourceMappingURL=output-params.js.map