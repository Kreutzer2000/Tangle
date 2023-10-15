"use strict";
// Copyright 2023 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.initLogger = void 0;
const bindings_1 = require("./bindings");
const defaultLoggerConfig = {
    colorEnabled: true,
    name: './iota-sdk.log',
    levelFilter: 'debug',
};
/** Initialize logger, if no arguments are provided a default config will be used. */
const initLogger = (config = defaultLoggerConfig) => (0, bindings_1.initLogger)(JSON.stringify(config));
exports.initLogger = initLogger;
//# sourceMappingURL=logger.js.map