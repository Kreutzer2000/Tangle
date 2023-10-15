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
// Needed for class-transformer json deserialisation
require("reflect-metadata");
const bindings_1 = require("./bindings");
const types_1 = require("./types");
const utils_1 = require("./utils");
// Allow bigint to be serialized as hex string.
//
// Note:
// Serializing `bigint` to a different format, e.g. to decimal number string
// must be done manually.
BigInt.prototype.toJSON = function () {
    return (0, utils_1.bigIntToHex)(this);
};
// Assign the util method on UTXOInput here,
// to prevent loading bindings (callUtilsMethod) when importing UTXOInput just for typing.
Object.assign(types_1.UTXOInput, {
    /**
     * Creates a `UTXOInput` from an output id.
     */
    fromOutputId(outputId) {
        const input = (0, bindings_1.callUtilsMethod)({
            name: 'outputIdToUtxoInput',
            data: {
                outputId,
            },
        });
        return new types_1.UTXOInput(input.transactionId, input.transactionOutputIndex);
    },
});
__exportStar(require("./client"), exports);
__exportStar(require("./secret_manager"), exports);
__exportStar(require("./types"), exports);
__exportStar(require("./utils"), exports);
__exportStar(require("./wallet"), exports);
__exportStar(require("./logger"), exports);
//# sourceMappingURL=index.js.map