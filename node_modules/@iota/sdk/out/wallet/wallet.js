"use strict";
// Copyright 2023 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wallet = void 0;
const wallet_method_handler_1 = require("./wallet-method-handler");
const account_1 = require("./account");
/** The Wallet class. */
class Wallet {
    /**
     * @param options Wallet options.
     */
    constructor(options) {
        this.methodHandler = new wallet_method_handler_1.WalletMethodHandler(options);
    }
    /**
     * Backup the data to a Stronghold snapshot.
     */
    async backup(destination, password) {
        await this.methodHandler.callMethod({
            name: 'backup',
            data: {
                destination,
                password,
            },
        });
    }
    /**
     * Change the Stronghold password.
     */
    async changeStrongholdPassword(currentPassword, newPassword) {
        await this.methodHandler.callMethod({
            name: 'changeStrongholdPassword',
            data: {
                currentPassword,
                newPassword,
            },
        });
    }
    /**
     * Clear the Stronghold password from memory.
     */
    async clearStrongholdPassword() {
        await this.methodHandler.callMethod({
            name: 'clearStrongholdPassword',
        });
    }
    /**
     * Create a new account.
     */
    async createAccount(data) {
        const response = await this.methodHandler.callMethod({
            name: 'createAccount',
            data,
        });
        return new account_1.Account(JSON.parse(response).payload, this.methodHandler);
    }
    /**
     * Destroy the Wallet and drop its database connection.
     */
    async destroy() {
        return this.methodHandler.destroy();
    }
    /**
     * Emit a provided event for testing of the event system.
     */
    async emitTestEvent(event) {
        await this.methodHandler.callMethod({
            name: 'emitTestEvent',
            data: { event },
        });
    }
    /**
     * Get an account by its alias or index.
     */
    async getAccount(accountId) {
        const response = await this.methodHandler.callMethod({
            name: 'getAccount',
            data: { accountId },
        });
        const account = new account_1.Account(JSON.parse(response).payload, this.methodHandler);
        return account;
    }
    /**
     * Get all account indexes.
     */
    async getAccountIndexes() {
        const response = await this.methodHandler.callMethod({
            name: 'getAccountIndexes',
        });
        return JSON.parse(response).payload;
    }
    /**
     * Get all accounts.
     */
    async getAccounts() {
        const response = await this.methodHandler.callMethod({
            name: 'getAccounts',
        });
        const { payload } = JSON.parse(response);
        const accounts = [];
        for (const account of payload) {
            accounts.push(new account_1.Account(account, this.methodHandler));
        }
        return accounts;
    }
    /**
     * Get client.
     */
    async getClient() {
        return this.methodHandler.getClient();
    }
    /**
     * Get chrysalis data.
     */
    async getChrysalisData() {
        const response = await this.methodHandler.callMethod({
            name: 'getChrysalisData',
        });
        return JSON.parse(response).payload;
    }
    /**
     * Get secret manager.
     */
    async getSecretManager() {
        return this.methodHandler.getSecretManager();
    }
    /**
     * Generate an address without storing it.
     */
    async generateEd25519Address(accountIndex, addressIndex, options, bech32Hrp) {
        const response = await this.methodHandler.callMethod({
            name: 'generateEd25519Address',
            data: {
                accountIndex,
                addressIndex,
                options,
                bech32Hrp,
            },
        });
        return JSON.parse(response).payload;
    }
    /**
     * Get the status for a Ledger Nano.
     */
    async getLedgerNanoStatus() {
        const response = await this.methodHandler.callMethod({
            name: 'getLedgerNanoStatus',
        });
        return JSON.parse(response).payload;
    }
    /**
     * Check if the Stronghold password has been set.
     */
    async isStrongholdPasswordAvailable() {
        const response = await this.methodHandler.callMethod({
            name: 'isStrongholdPasswordAvailable',
        });
        return JSON.parse(response).payload;
    }
    /**
     * Listen to wallet events with a callback. An empty array will listen to all possible events.
     */
    async listen(eventTypes, callback) {
        return this.methodHandler.listen(eventTypes, callback);
    }
    /**
     * Clear the callbacks for provided events. An empty array will clear all listeners.
     */
    async clearListeners(eventTypes) {
        const response = await this.methodHandler.callMethod({
            name: 'clearListeners',
            data: { eventTypes },
        });
        return JSON.parse(response).payload;
    }
    /**
     * Find accounts with unspent outputs.
     */
    async recoverAccounts(accountStartIndex, accountGapLimit, addressGapLimit, syncOptions) {
        const response = await this.methodHandler.callMethod({
            name: 'recoverAccounts',
            data: {
                accountStartIndex,
                accountGapLimit,
                addressGapLimit,
                syncOptions,
            },
        });
        const accounts = [];
        for (const account of JSON.parse(response).payload) {
            accounts.push(new account_1.Account(account, this.methodHandler));
        }
        return accounts;
    }
    /**
     * Delete the latest account.
     */
    async removeLatestAccount() {
        await this.methodHandler.callMethod({
            name: 'removeLatestAccount',
        });
    }
    /**
     * Restore a backup from a Stronghold file
     * Replaces client_options, coin_type, secret_manager and accounts. Returns an error if accounts were already created
     * If Stronghold is used as secret_manager, the existing Stronghold file will be overwritten. If a mnemonic was
     * stored, it will be gone.
     * if ignore_if_coin_type_mismatch is provided client options will not be restored
     * if ignore_if_coin_type_mismatch == true, client options coin type and accounts will not be restored if the cointype doesn't match
     * if ignore_if_bech32_hrp_mismatch == Some("rms"), but addresses have something different like "smr", no accounts
     * will be restored.
     */
    async restoreBackup(source, password, ignoreIfCoinTypeMismatch, ignoreIfBech32Mismatch) {
        await this.methodHandler.callMethod({
            name: 'restoreBackup',
            data: {
                source,
                password,
                ignoreIfCoinTypeMismatch,
                ignoreIfBech32Mismatch,
            },
        });
    }
    /**
     * Set ClientOptions.
     */
    async setClientOptions(clientOptions) {
        await this.methodHandler.callMethod({
            name: 'setClientOptions',
            data: { clientOptions },
        });
    }
    /**
     * Set the Stronghold password.
     */
    async setStrongholdPassword(password) {
        await this.methodHandler.callMethod({
            name: 'setStrongholdPassword',
            data: { password },
        });
    }
    /**
     * Set the interval after which the Stronghold password gets cleared from memory.
     */
    async setStrongholdPasswordClearInterval(intervalInMilliseconds) {
        await this.methodHandler.callMethod({
            name: 'setStrongholdPasswordClearInterval',
            data: { intervalInMilliseconds },
        });
    }
    /**
     * Start the background syncing process for all accounts.
     */
    async startBackgroundSync(options, intervalInMilliseconds) {
        await this.methodHandler.callMethod({
            name: 'startBackgroundSync',
            data: {
                options,
                intervalInMilliseconds,
            },
        });
    }
    /**
     * Stop the background syncing process for all accounts.
     */
    async stopBackgroundSync() {
        await this.methodHandler.callMethod({
            name: 'stopBackgroundSync',
        });
    }
    /**
     * Store a mnemonic in the Stronghold snapshot.
     */
    async storeMnemonic(mnemonic) {
        await this.methodHandler.callMethod({
            name: 'storeMnemonic',
            data: { mnemonic },
        });
    }
    /**
     * Update the authentication for the provided node.
     */
    async updateNodeAuth(url, auth) {
        await this.methodHandler.callMethod({
            name: 'updateNodeAuth',
            data: { url, auth },
        });
    }
}
exports.Wallet = Wallet;
//# sourceMappingURL=wallet.js.map