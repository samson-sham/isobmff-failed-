import { Duplex } from 'stream';
import Box from './Box';

export default class MediaPipe extends Duplex {
    public totalBytes: bigint;
    public documentTree: any[];

    constructor() {
        super();
        this.totalBytes = BigInt(0);
        this.documentTree = [];
    }
    // Input stream
    _write(chunk: Buffer, encoding: string, callback: (error?: any) => void) {
        
    }
    // Output stream
    _read(size: number) {}
}