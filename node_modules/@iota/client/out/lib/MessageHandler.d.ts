import type { IClientOptions, __ClientMessages__ } from '../types';
/** The MessageHandler which sends the commands to the Rust side. */
export declare class MessageHandler {
    messageHandler: MessageHandler;
    constructor(options: IClientOptions);
    sendMessage(message: __ClientMessages__): Promise<string>;
    listen(topics: string[], callback: (error: Error, result: string) => void): void;
}
