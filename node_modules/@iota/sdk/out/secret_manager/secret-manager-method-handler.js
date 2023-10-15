"use strict";
// Copyright 2021-2023 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.migrateStrongholdSnapshotV2ToV3 = exports.SecretManagerMethodHandler = void 0;
const bindings_1 = require("../bindings");
Object.defineProperty(exports, "migrateStrongholdSnapshotV2ToV3", { enumerable: true, get: function () { return bindings_1.migrateStrongholdSnapshotV2ToV3; } });
/** The MethodHandler which sends the commands to the Rust backend. */
class SecretManagerMethodHandler {
    /**
     * @param options A secret manager type or a secret manager method handler.
     */
    constructor(options) {
        // The rust secret manager object is not extensible
        if (Object.isExtensible(options)) {
            this.methodHandler = (0, bindings_1.createSecretManager)(JSON.stringify(options));
        }
        else {
            this.methodHandler = options;
        }
    }
    /**
     * Call a secret manager method.
     *
     * @param method One of the supported secret manager methods.
     * @returns The JSON response of the method.
     */
    async callMethod(method) {
        return (0, bindings_1.callSecretManagerMethodAsync)(JSON.stringify(method), this.methodHandler);
    }
}
exports.SecretManagerMethodHandler = SecretManagerMethodHandler;
//# sourceMappingURL=secret-manager-method-handler.js.map