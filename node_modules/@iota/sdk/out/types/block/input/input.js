"use strict";
// Copyright 2023 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.UTXOInput = exports.TreasuryInput = exports.Input = exports.InputType = exports.InputDiscriminator = void 0;
/**
 * All of the transaction input types.
 */
var InputType;
(function (InputType) {
    /** A UTXO input. */
    InputType[InputType["UTXO"] = 0] = "UTXO";
    /** The treasury input. */
    InputType[InputType["Treasury"] = 1] = "Treasury";
})(InputType || (InputType = {}));
exports.InputType = InputType;
/**
 * The base class for transaction inputs.
 */
class Input {
    /**
     * @param type The type of input.
     */
    constructor(type) {
        this.type = type;
    }
    /**
     * Get the type of input.
     */
    getType() {
        return this.type;
    }
}
exports.Input = Input;
/**
 * A Treasury input.
 */
class TreasuryInput extends Input {
    /**
     * @param milestoneId The milestone id of the input.
     */
    constructor(milestoneId) {
        super(InputType.Treasury);
        this.milestoneId = milestoneId;
    }
}
exports.TreasuryInput = TreasuryInput;
/**
 * A UTXO transaction input.
 */
class UTXOInput extends Input {
    /**
     * @param transactionId The ID of the transaction it is an input of.
     * @param transactionOutputIndex The index of the input within the transaction.
     */
    constructor(transactionId, transactionOutputIndex) {
        super(InputType.UTXO);
        this.transactionId = transactionId;
        this.transactionOutputIndex = transactionOutputIndex;
    }
    /**
     * Create a `UTXOInput` from a given output ID.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    static fromOutputId(outputId) {
        // Implementation injected in lib/index.ts, as it uses bindings.
        return null;
    }
}
exports.UTXOInput = UTXOInput;
const InputDiscriminator = {
    property: 'type',
    subTypes: [
        { value: TreasuryInput, name: InputType.Treasury },
        { value: UTXOInput, name: InputType.UTXO },
    ],
};
exports.InputDiscriminator = InputDiscriminator;
//# sourceMappingURL=input.js.map