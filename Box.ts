import {typedArrayToASCII} from './util';
import { numericLiteral } from '@babel/types';
interface BoxInterface {
    boxType: string
}
export default class Box implements BoxInterface {
    public boxType: string;
    public boxSize: bigint;
    protected _loaded: bigint;
    protected _buffer?: Buffer;
    constructor() {
        this.boxType = "unknown";
        this.boxSize = BigInt(0);
        this._loaded = BigInt(0);
    }
    parseBoxSize(chunk: Buffer): [bigint, boolean] {
        if (chunk.byteLength < 4) throw new Error('Chunk less than 4 bytes');
        const boxLength: number = chunk.readUInt32BE(0);
        const isLargeChunk: boolean = boxLength === 1;
        // Check large chunk
        if (isLargeChunk) {
            if (chunk.byteLength < (8+8)) throw new Error('Chunk less than 16 bytes while having large chunk flag');
            const largeBoxLength = chunk.readBigUInt64BE(8);
            return [largeBoxLength, isLargeChunk];
        }
        return [BigInt(boxLength), isLargeChunk];
    }
    protected parseHeader(chunk: Buffer): Buffer {
        this.boxType = chunk.toString('utf8', 4, 8);
        const [boxSize, isLargeChunk] = this.parseBoxSize(chunk);
        this.boxSize = boxSize;
        return chunk.subarray(isLargeChunk ? 16 : 8);
    }
    pipe(chunk: Buffer): Buffer|undefined {
        if (!this.boxSize) {
            chunk = this.parseHeader(chunk);
        }
        this._loaded += BigInt(chunk.length);
        if (this._loaded <= this.boxSize) return void 0;
        if (this._loaded > this.boxSize) {
            const overflow = this.boxSize - this._loaded;
            if (overflow < Number.MIN_SAFE_INTEGER) throw new Error(`Too much overflow, cannot handle ${overflow}`);
            return chunk.subarray(Number(overflow));
        }
    }
    parse(typedArray: Buffer): boolean {
        // this.boxType = this.readString(typedArray);
        // // Remove \u0000
        // this.boxType = Array.prototype.filter.call(this.boxType, char => !char.match(/[^a-zA-Z0-9]/)).join("");
        // return !!this.boxType.length;
        return true;
    }
    protected readString(typedArray: Buffer, bit: number = 32): string {
    //     const result = typedArrayToASCII(typedArray.subarray(this._anchor,this._anchor+4));
    //     this._anchor += 4;
    //     return result;
        return ""
    }
    // protected readNumber(dataView: data) {
        
    // }
}