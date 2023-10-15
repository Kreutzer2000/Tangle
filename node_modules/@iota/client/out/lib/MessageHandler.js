"use strict";
// Copyright 2021-2022 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageHandler = void 0;
const bindings_1 = require("./bindings");
/** The MessageHandler which sends the commands to the Rust side. */
class MessageHandler {
    constructor(options) {
        this.messageHandler = (0, bindings_1.messageHandlerNew)(JSON.stringify(options));
    }
    async sendMessage(message) {
        return (0, bindings_1.sendMessageAsync)(JSON.stringify(message), this.messageHandler);
    }
    // MQTT
    listen(topics, callback) {
        return (0, bindings_1.listen)(topics, callback, this.messageHandler);
    }
}
exports.MessageHandler = MessageHandler;
//# sourceMappingURL=MessageHandler.js.map