"use strict";
// Copyright 2023 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientMethodHandler = void 0;
const bindings_1 = require("../bindings");
/**
 * The MethodHandler which sends the commands to the Rust side.
 */
class ClientMethodHandler {
    /**
     * @param options client options or a client method handler.
     */
    constructor(options) {
        // The rust client object is not extensible
        if (Object.isExtensible(options)) {
            this.methodHandler = (0, bindings_1.createClient)(JSON.stringify(options));
        }
        else {
            this.methodHandler = options;
        }
    }
    async destroy() {
        return (0, bindings_1.destroyClient)(this.methodHandler);
    }
    /**
     * Call a client method.
     *
     * @param method The client method.
     * @returns A promise that resolves to a JSON string response holding the result of the client method.
     */
    async callMethod(method) {
        return (0, bindings_1.callClientMethodAsync)(JSON.stringify(method), this.methodHandler);
    }
    /**
     * Listen to MQTT events.
     *
     * @param topics The topics to listen to.
     * @param callback The callback to be called when an MQTT event is received.
     */
    async listen(topics, callback) {
        return (0, bindings_1.listenMqtt)(topics, callback, this.methodHandler);
    }
}
exports.ClientMethodHandler = ClientMethodHandler;
//# sourceMappingURL=client-method-handler.js.map