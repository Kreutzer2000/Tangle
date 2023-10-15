"use strict";
// Copyright 2023 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONFLICT_REASON_STRINGS = exports.ConflictReason = void 0;
/**
 * Reason for block conflicts.
 */
var ConflictReason;
(function (ConflictReason) {
    /**
     * The block has no conflict.
     */
    ConflictReason[ConflictReason["none"] = 0] = "none";
    /**
     * The referenced UTXO was already spent.
     */
    ConflictReason[ConflictReason["inputUTXOAlreadySpent"] = 1] = "inputUTXOAlreadySpent";
    /**
     * The referenced UTXO was already spent while confirming this milestone.
     */
    ConflictReason[ConflictReason["inputUTXOAlreadySpentInThisMilestone"] = 2] = "inputUTXOAlreadySpentInThisMilestone";
    /**
     * The referenced UTXO cannot be found.
     */
    ConflictReason[ConflictReason["inputUTXONotFound"] = 3] = "inputUTXONotFound";
    /**
     * The sum of the inputs and output values does not match.
     */
    ConflictReason[ConflictReason["inputOutputSumMismatch"] = 4] = "inputOutputSumMismatch";
    /**
     * The unlock signature is invalid.
     */
    ConflictReason[ConflictReason["invalidSignature"] = 5] = "invalidSignature";
    /**
     * The configured timelock is not yet expired.
     */
    ConflictReason[ConflictReason["invalidTimelock"] = 6] = "invalidTimelock";
    /**
     * The native tokens are invalid.
     */
    ConflictReason[ConflictReason["invalidNativeTokens"] = 7] = "invalidNativeTokens";
    /**
     * The return amount in a transaction is not fulfilled by the output side.
     */
    ConflictReason[ConflictReason["returnAmountMismatch"] = 8] = "returnAmountMismatch";
    /**
     * The input unlock is invalid.
     */
    ConflictReason[ConflictReason["invalidInputUnlock"] = 9] = "invalidInputUnlock";
    /**
     * The inputs commitment is invalid.
     */
    ConflictReason[ConflictReason["invalidInputsCommitment"] = 10] = "invalidInputsCommitment";
    /**
     * The output contains a Sender with an ident (address) which is not unlocked.
     */
    ConflictReason[ConflictReason["invalidSender"] = 11] = "invalidSender";
    /**
     * The chain state transition is invalid.
     */
    ConflictReason[ConflictReason["invalidChainState"] = 12] = "invalidChainState";
    /**
     * The semantic validation failed.
     */
    ConflictReason[ConflictReason["semanticValidationFailed"] = 255] = "semanticValidationFailed";
})(ConflictReason = exports.ConflictReason || (exports.ConflictReason = {}));
/**
 * Conflict reason strings.
 */
exports.CONFLICT_REASON_STRINGS = {
    [ConflictReason.none]: 'The block has no conflict',
    [ConflictReason.inputUTXOAlreadySpent]: 'The referenced UTXO was already spent',
    [ConflictReason.inputUTXOAlreadySpentInThisMilestone]: 'The referenced UTXO was already spent while confirming this milestone',
    [ConflictReason.inputUTXONotFound]: 'The referenced UTXO cannot be found',
    [ConflictReason.inputOutputSumMismatch]: 'The sum of the inputs and output values does not match',
    [ConflictReason.invalidSignature]: 'The unlock block signature is invalid',
    [ConflictReason.invalidTimelock]: 'The configured timelock is not yet expired',
    [ConflictReason.invalidNativeTokens]: 'The native tokens are invalid',
    [ConflictReason.returnAmountMismatch]: 'The return amount in a transaction is not fulfilled by the output side',
    [ConflictReason.invalidInputUnlock]: 'The input unlock is invalid',
    [ConflictReason.invalidInputsCommitment]: 'The inputs commitment is invalid',
    [ConflictReason.invalidSender]: ' The output contains a Sender with an ident (address) which is not unlocked',
    [ConflictReason.invalidChainState]: 'The chain state transition is invalid',
    [ConflictReason.semanticValidationFailed]: 'The semantic validation failed',
};
//# sourceMappingURL=conflict-reason.js.map