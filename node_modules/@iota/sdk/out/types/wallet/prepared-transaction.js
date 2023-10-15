"use strict";
// Copyright 2021-2023 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.PreparedTransaction = void 0;
/**
 * PreparedTransaction` is a class that represents prepared transaction data, which
 * is useful for offline signing. It contains the prepared transaction data and an
 * `Account` object. It provides methods to retrieve the prepared transaction data, sign
 * the transaction and sign+submit/send the transaction.
 */
class PreparedTransaction {
    /**
     * @param preparedData Prepared data to sign and submit a transaction.
     * @param account A wallet account.
     */
    constructor(preparedData, account) {
        this._preparedData = preparedData;
        this._account = account;
    }
    /**
     * The function returns the prepared transaction data.
     *
     * Returns:
     *
     * The method `preparedTransactionData()` is returning an object of type
     * `PreparedTransactionData`.
     */
    preparedTransactionData() {
        return this._preparedData;
    }
    /**
     * The `send` function returns a promise that resolves to a `Transaction` object after signing
     * and submitting the transaction. Internally just calls `signAndSubmitTransaction`.
     *
     * Returns:
     *
     * The `send()` method is returning a `Promise` that resolves to a `Transaction` object after it
     * has been signed and submitted.
     */
    async send() {
        return this.signAndSubmitTransaction();
    }
    /**
     * This function signs a prepared transaction essence using the account's private key and returns
     * the signed transaction essence.
     *
     * Returns:
     *
     * A `Promise` that resolves to a `SignedTransactionEssence` object.
     */
    async sign() {
        return this._account.signTransactionEssence(this.preparedTransactionData());
    }
    /**
     * This function signs and submits a transaction using prepared transaction data.
     *
     * Returns:
     *
     * A Promise that resolves to a Transaction object.
     */
    async signAndSubmitTransaction() {
        return this._account.signAndSubmitTransaction(this.preparedTransactionData());
    }
}
exports.PreparedTransaction = PreparedTransaction;
//# sourceMappingURL=prepared-transaction.js.map