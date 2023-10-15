"use strict";
// Copyright 2023 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionProgressType = exports.BroadcastingProgress = exports.PerformingPowProgress = exports.SigningTransactionProgress = exports.PreparedTransactionEssenceHashProgress = exports.PreparedTransactionProgress = exports.GeneratingRemainderDepositAddressProgress = exports.SelectingInputsProgress = exports.TransactionProgress = exports.TransactionProgressWalletEvent = exports.TransactionInclusionWalletEvent = exports.SpentOutputWalletEvent = exports.NewOutputWalletEvent = exports.LedgerAddressGenerationWalletEvent = exports.ConsolidationRequiredWalletEvent = exports.WalletEvent = exports.WalletEventType = exports.Event = void 0;
/**
 * An wallet account event.
 */
class Event {
    /**
     * @param accountIndex The account index.
     * @param event The wallet event.
     */
    constructor(accountIndex, event) {
        this.accountIndex = accountIndex;
        this.event = event;
    }
}
exports.Event = Event;
/**
 * All of the wallet event types.
 */
var WalletEventType;
(function (WalletEventType) {
    /** Consolidation is required. */
    WalletEventType[WalletEventType["ConsolidationRequired"] = 0] = "ConsolidationRequired";
    /** Nano Ledger has generated an address. */
    WalletEventType[WalletEventType["LedgerAddressGeneration"] = 1] = "LedgerAddressGeneration";
    /** A new output was created. */
    WalletEventType[WalletEventType["NewOutput"] = 2] = "NewOutput";
    /** An output was spent. */
    WalletEventType[WalletEventType["SpentOutput"] = 3] = "SpentOutput";
    /** A transaction was included into the ledger. */
    WalletEventType[WalletEventType["TransactionInclusion"] = 4] = "TransactionInclusion";
    /** A progress update while submitting a transaction. */
    WalletEventType[WalletEventType["TransactionProgress"] = 5] = "TransactionProgress";
})(WalletEventType || (WalletEventType = {}));
exports.WalletEventType = WalletEventType;
/**
 * The base class for wallet events.
 */
class WalletEvent {
    /**
     * @param type The type of wallet event.
     */
    constructor(type) {
        this.type = type;
    }
}
exports.WalletEvent = WalletEvent;
/**
 * A 'consolidation required' wallet event.
 */
class ConsolidationRequiredWalletEvent extends WalletEvent {
    constructor() {
        super(WalletEventType.ConsolidationRequired);
    }
}
exports.ConsolidationRequiredWalletEvent = ConsolidationRequiredWalletEvent;
/**
 * A 'ledger address generation' wallet event.
 */
class LedgerAddressGenerationWalletEvent extends WalletEvent {
    /**
     * @param address The generated address.
     */
    constructor(address) {
        super(WalletEventType.LedgerAddressGeneration);
        this.address = address;
    }
}
exports.LedgerAddressGenerationWalletEvent = LedgerAddressGenerationWalletEvent;
/**
 * A 'new output' wallet event.
 */
class NewOutputWalletEvent extends WalletEvent {
    /**
     * @param output The new output.
     * @param transaction The transaction that created the output. Might be pruned and not available.
     * @param transactionInputs The inputs for the transaction that created the output. Might be pruned and not available.
     */
    constructor(output, transaction, transactionInputs) {
        super(WalletEventType.NewOutput);
        this.output = output;
        this.transaction = transaction;
        this.transactionInputs = transactionInputs;
    }
}
exports.NewOutputWalletEvent = NewOutputWalletEvent;
/**
 * A 'spent output' wallet event.
 */
class SpentOutputWalletEvent extends WalletEvent {
    /**
     * @param output The spent output.
     */
    constructor(output) {
        super(WalletEventType.SpentOutput);
        this.output = output;
    }
}
exports.SpentOutputWalletEvent = SpentOutputWalletEvent;
/**
 * A 'transaction inclusion' wallet event.
 */
class TransactionInclusionWalletEvent extends WalletEvent {
    /**
     * @param transactionId The transaction ID.
     * @param inclusionState The inclusion state of the transaction.
     */
    constructor(transactionId, inclusionState) {
        super(WalletEventType.TransactionInclusion);
        this.transactionId = transactionId;
        this.inclusionState = inclusionState;
    }
}
exports.TransactionInclusionWalletEvent = TransactionInclusionWalletEvent;
/**
 * All of the transaction progress types.
 */
var TransactionProgressType;
(function (TransactionProgressType) {
    /** Performing input selection. */
    TransactionProgressType[TransactionProgressType["SelectingInputs"] = 0] = "SelectingInputs";
    /** Generating remainder value deposit address. */
    TransactionProgressType[TransactionProgressType["GeneratingRemainderDepositAddress"] = 1] = "GeneratingRemainderDepositAddress";
    /** Prepared transaction. */
    TransactionProgressType[TransactionProgressType["PreparedTransaction"] = 2] = "PreparedTransaction";
    /** Prepared transaction essence hash hex encoded, required for blindsigning with a Ledger Nano. */
    TransactionProgressType[TransactionProgressType["PreparedTransactionEssenceHash"] = 3] = "PreparedTransactionEssenceHash";
    /** Signing the transaction. */
    TransactionProgressType[TransactionProgressType["SigningTransaction"] = 4] = "SigningTransaction";
    /** Performing PoW. */
    TransactionProgressType[TransactionProgressType["PerformingPow"] = 5] = "PerformingPow";
    /** Broadcasting. */
    TransactionProgressType[TransactionProgressType["Broadcasting"] = 6] = "Broadcasting";
})(TransactionProgressType || (TransactionProgressType = {}));
exports.TransactionProgressType = TransactionProgressType;
/**
 * A 'transaction progress' wallet event.
 */
class TransactionProgressWalletEvent extends WalletEvent {
    /**
     * @param progress The progress of the transaction.
     */
    constructor(progress) {
        super(WalletEventType.TransactionProgress);
        this.progress = progress;
    }
}
exports.TransactionProgressWalletEvent = TransactionProgressWalletEvent;
/**
 * The base class for transaction progresses.
 */
class TransactionProgress {
    /**
     * @param type The type of transaction progress.
     */
    constructor(type) {
        this.type = type;
    }
}
exports.TransactionProgress = TransactionProgress;
/**
 * A 'selecting inputs' progress.
 */
class SelectingInputsProgress extends TransactionProgress {
    constructor() {
        super(TransactionProgressType.SelectingInputs);
    }
}
exports.SelectingInputsProgress = SelectingInputsProgress;
/**
 * A 'generating remainder deposit address' progress.
 */
class GeneratingRemainderDepositAddressProgress extends TransactionProgress {
    /**
     * @param address The generated remainder deposit address.
     */
    constructor(address) {
        super(TransactionProgressType.GeneratingRemainderDepositAddress);
        this.address = address;
    }
}
exports.GeneratingRemainderDepositAddressProgress = GeneratingRemainderDepositAddressProgress;
/**
 * A 'prepared transaction' progress.
 */
class PreparedTransactionProgress extends TransactionProgress {
    /**
     * @param essence The essence of the prepared transaction.
     * @param inputsData Input signing parameters.
     * @param remainder Remainder output parameters.
     */
    constructor(essence, inputsData, remainder) {
        super(TransactionProgressType.PreparedTransaction);
        this.essence = essence;
        this.inputsData = inputsData;
        this.remainder = remainder;
    }
}
exports.PreparedTransactionProgress = PreparedTransactionProgress;
/**
 * A 'prepared transaction essence hash' progress.
 */
class PreparedTransactionEssenceHashProgress extends TransactionProgress {
    /**
     * @param hash The hash of the transaction essence.
     */
    constructor(hash) {
        super(TransactionProgressType.PreparedTransactionEssenceHash);
        this.hash = hash;
    }
}
exports.PreparedTransactionEssenceHashProgress = PreparedTransactionEssenceHashProgress;
/**
 * A 'signing transaction' progress.
 */
class SigningTransactionProgress extends TransactionProgress {
    constructor() {
        super(TransactionProgressType.SigningTransaction);
    }
}
exports.SigningTransactionProgress = SigningTransactionProgress;
/**
 * A 'performing PoW' progress.
 */
class PerformingPowProgress extends TransactionProgress {
    constructor() {
        super(TransactionProgressType.PerformingPow);
    }
}
exports.PerformingPowProgress = PerformingPowProgress;
/**
 * A 'broadcasting' progress.
 */
class BroadcastingProgress extends TransactionProgress {
    constructor() {
        super(TransactionProgressType.Broadcasting);
    }
}
exports.BroadcastingProgress = BroadcastingProgress;
//# sourceMappingURL=event.js.map