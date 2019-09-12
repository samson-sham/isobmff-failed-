import { InsufficientDataToParseError, DataOverflowError } from './util';
interface BoxInterface {
    boxType: string
}

const ENCODING = 'utf8';

export default class Box implements BoxInterface {
    public boxType: string;
    public boxSize: bigint;
    public isLargeChunk: boolean;
    protected _loaded: bigint;
    protected _buffer?: Buffer;
    constructor() {
        this.boxType = "unknown";
        this.boxSize = BigInt(0);
        this.isLargeChunk = false;
        this._loaded = BigInt(0);
    }
    parseBoxSize(chunk: Buffer): [bigint, boolean] {
        if (chunk.byteLength < 4) throw new InsufficientDataToParseError('[Box.parseBoxSize] Chunk less than 4 bytes');
        const boxLength: number = chunk.readUInt32BE(0);
        const isLargeChunk: boolean = boxLength === 1;
        // Check large chunk
        if (isLargeChunk) {
            if (chunk.byteLength < (8+8)) throw new InsufficientDataToParseError('[Box.parseBoxSize] Chunk less than 16 bytes while having large chunk flag');
            const largeBoxLength = chunk.readBigUInt64BE(8);
            return [largeBoxLength, isLargeChunk];
        }
        return [BigInt(boxLength), isLargeChunk];
    }
    protected parseHeader(chunk: Buffer): Buffer {
        this.boxType = chunk.toString(ENCODING, 4, 8);
        const [boxSize, isLargeChunk] = this.parseBoxSize(chunk);
        this.boxSize = boxSize;
        this.isLargeChunk = isLargeChunk;
        return chunk.subarray(isLargeChunk ? 16 : 8);
    }
    protected readString(chunk: Buffer, byte: number = 4): [string, Buffer] {
        if (chunk.length < byte) throw new InsufficientDataToParseError(`[Box.readString] Chunk less than ${byte} bytes`);
        return [chunk.toString('utf8', 0, byte), chunk.subarray(byte)];
    }
    protected readInt(chunk: Buffer, byte: number = 4): [number, Buffer] {
        if (chunk.length < byte) throw new InsufficientDataToParseError("[Box.readInt] Chunk less than ${byte} bytes");
        return [chunk.readUInt32BE(0), chunk.subarray(byte)];
    }
    pipe(chunk: Buffer): [Buffer|undefined, boolean] {
        if (!this.boxSize) {
            chunk = this.parseHeader(chunk);
        }
        this._loaded += BigInt(chunk.length);
        const isPipeDone: boolean = this._loaded >= this.boxSize;
        if (this._loaded <= this.boxSize) return [void 0, isPipeDone];
        // this._loaded > this.boxSize)
        const overflow = this.boxSize - this._loaded;
        if (overflow < Number.MIN_SAFE_INTEGER) throw new DataOverflowError(`[Box.pipe] Too much overflow, cannot handle ${overflow}`);
        return [chunk.subarray(Number(overflow)), isPipeDone];
    }
    // parse(typedArray: Buffer): boolean {
    //     // this.boxType = this.readString(typedArray);
    //     // // Remove \u0000
    //     // this.boxType = Array.prototype.filter.call(this.boxType, char => !char.match(/[^a-zA-Z0-9]/)).join("");
    //     // return !!this.boxType.length;
    //     return true;
    // }
    // protected readString(typedArray: Buffer, bit: number = 32): string {
    // //     const result = typedArrayToASCII(typedArray.subarray(this._anchor,this._anchor+4));
    // //     this._anchor += 4;
    // //     return result;
    //     return ""
    // }
    // protected readNumber(dataView: data) {
        
    // }
}