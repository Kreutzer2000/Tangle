"use strict";
// Copyright 2021-2023 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.PreparedCreateNativeTokenTransaction = void 0;
const prepared_transaction_1 = require("./prepared-transaction");
/*
 * The class PreparedCreateNativeTokenTransaction represents prepared data for issuing a transaction to create a native token.
 */
class PreparedCreateNativeTokenTransaction extends prepared_transaction_1.PreparedTransaction {
    /**
     * @param preparedData Prepared data to create a Native Token.
     * @param account A wallet account.
     */
    constructor(preparedData, account) {
        super(preparedData.transaction, account);
        this._tokenId = preparedData.tokenId;
    }
    /**
     * The function returns the tokenId as a string.
     *
     * Returns:
     *
     * The token id of the CreateNativeTokenTransaction.
     */
    tokenId() {
        return this._tokenId;
    }
}
exports.PreparedCreateNativeTokenTransaction = PreparedCreateNativeTokenTransaction;
//# sourceMappingURL=prepared-create-token-transaction.js.map