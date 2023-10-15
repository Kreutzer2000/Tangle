"use strict";
// Copyright 2023 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecretManager = void 0;
const secret_manager_method_handler_1 = require("./secret-manager-method-handler");
const types_1 = require("../types");
const class_transformer_1 = require("class-transformer");
/** The SecretManager to interact with nodes. */
class SecretManager {
    /**
     * @param options A secret manager type or a secret manager method handler.
     */
    constructor(options) {
        this.methodHandler = new secret_manager_method_handler_1.SecretManagerMethodHandler(options);
    }
    /**
     * Generate Ed25519 addresses.
     *
     * @param generateAddressesOptions Options to generate addresses.
     * @returns An array of generated addresses.
     */
    async generateEd25519Addresses(generateAddressesOptions) {
        const response = await this.methodHandler.callMethod({
            name: 'generateEd25519Addresses',
            data: {
                options: generateAddressesOptions,
            },
        });
        return JSON.parse(response).payload;
    }
    /**
     * Generate EVM addresses.
     *
     * @param generateAddressesOptions Options to generate addresses.
     * @returns An array of generated addresses.
     */
    async generateEvmAddresses(generateAddressesOptions) {
        const response = await this.methodHandler.callMethod({
            name: 'generateEvmAddresses',
            data: {
                options: generateAddressesOptions,
            },
        });
        return JSON.parse(response).payload;
    }
    /**
     * Store a mnemonic in the Stronghold vault.
     *
     * @param mnemonic The mnemonic to store.
     */
    async storeMnemonic(mnemonic) {
        const response = await this.methodHandler.callMethod({
            name: 'storeMnemonic',
            data: {
                mnemonic,
            },
        });
        return JSON.parse(response).payload;
    }
    /**
     * Sign a transaction.
     *
     * @param preparedTransactionData An instance of `PreparedTransactionData`.
     * @returns The corresponding transaction payload.
     */
    async signTransaction(preparedTransactionData) {
        const response = await this.methodHandler.callMethod({
            name: 'signTransaction',
            data: {
                preparedTransactionData,
            },
        });
        const parsed = JSON.parse(response);
        return (0, class_transformer_1.plainToInstance)(types_1.TransactionPayload, parsed.payload);
    }
    /**
     * Create a signature unlock using the provided `secretManager`.
     *
     * @param transactionEssenceHash The hash of the transaction essence.
     * @param chain A BIP44 chain.
     * @returns The corresponding unlock.
     */
    async signatureUnlock(transactionEssenceHash, chain) {
        const response = await this.methodHandler.callMethod({
            name: 'signatureUnlock',
            data: {
                transactionEssenceHash,
                chain,
            },
        });
        return JSON.parse(response).payload;
    }
    /**
     * Signs a message with an Ed25519 private key.
     *
     * @param message The message to sign.
     * @param chain A BIP44 chain.
     * @returns The corresponding signature.
     */
    async signEd25519(message, chain) {
        const response = await this.methodHandler.callMethod({
            name: 'signEd25519',
            data: {
                message,
                chain,
            },
        });
        return JSON.parse(response).payload;
    }
    /**
     * Signs a message with an Secp256k1Ecdsa private key.
     *
     * @param message The message to sign.
     * @param chain A BIP44 chain.
     * @returns The corresponding signature.
     */
    async signSecp256k1Ecdsa(message, chain) {
        const response = await this.methodHandler.callMethod({
            name: 'signSecp256k1Ecdsa',
            data: {
                message,
                chain,
            },
        });
        return JSON.parse(response).payload;
    }
    /**
     * Get the status of a Ledger Nano.
     */
    async getLedgerNanoStatus() {
        const response = await this.methodHandler.callMethod({
            name: 'getLedgerNanoStatus',
        });
        return JSON.parse(response).payload;
    }
}
exports.SecretManager = SecretManager;
//# sourceMappingURL=secret-manager.js.map