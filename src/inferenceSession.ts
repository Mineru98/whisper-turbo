import { Session } from "./session.worker";
import * as Comlink from "comlink";
import { Result } from "true-myth";

/// Abstracts over a session running in a web worker
/// or in the main thread.
export class InferenceSession {
    private session: Comlink.Remote<Session> | Session | null;

    constructor(session: Comlink.Remote<Session> | Session) {
        this.session = session;
    }

    async initSession(model_bytes: Uint8Array, tokenizer_bytes: Uint8Array): Promise<Result<void, Error>> {
        return await this.session!.initSession(model_bytes, tokenizer_bytes);
    }

    public async run(audio: Uint8Array): Promise<Result<string, Error>> {
        if (this.session !== null) { 
            return await this.session!.run(audio);
        }else {
            return Result.err(new Error("Session not initialized"));
        }
    }

    public destroy(): void {
        this.session = null;
    }
}