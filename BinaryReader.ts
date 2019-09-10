import { Duplex } from 'stream';
import { TypedArray, getAtom, concatTypedArray } from './util';
import FileTypeBox from './FileTypeBox';
import Box from './Box';

// import * as Stream from 'stream';
export default class StreamReader extends Duplex {
    public totalBytes: number;
    protected _buffer?: TypedArray;
    public documentTree: any[];
    constructor() {
        super();
        this.totalBytes = 0;
        this.documentTree = [];
    }
    private __atomize(data: TypedArray, atoms: TypedArray[] = []): [TypedArray[], TypedArray] {
        if (data.byteLength < 4) return [atoms, data];
        console.log(data.buffer);
        const atomLength: number|bigint = (new DataView(data.buffer, data.byteOffset, 4)).getUint32(0);
        // @TODO: Large size atom
        if (atomLength === 1) {
            const largeLength = (new DataView(data.buffer, 8, 8)).getBigUint64(0);
            console.log("[__atomize] Large Atom size:", largeLength);
        } else {
            console.log("[__atomize] Atom size:", atomLength);
        }
        if (data.byteLength < atomLength) return [atoms, data];
        atoms = atoms.concat(data.subarray(4, atomLength));
        return this.__atomize(data.subarray(atomLength), atoms);
    }
    // Getting atom through data pipe
    _getAtoms(typedArray: TypedArray): TypedArray[] {
        let processingBuffer;
        // Check if previous buffer has left
        if (this._buffer) {
            processingBuffer = concatTypedArray(this._buffer, typedArray);
            this._buffer = void 0;
        } else {
            processingBuffer = typedArray;
        }
        const [atoms, residue] = this.__atomize(processingBuffer);
        if (residue.byteLength) {
            this._buffer = residue;
        }
        return atoms;
    }
    // Input stream
    _write(chunk: any, encoding: string, callback: (error?: any) => void) {
        const atoms = this._getAtoms(chunk);
        // Insufficient buffer to parse a single atom
        if (!atoms.length) return callback();
        atoms.map(atom => {
            const box = new Box();
            box.parse(atom);
            console.log("Atom:", box.boxType);
            switch (box.boxType) {
                case "ftyp":
                    const ftyp = Object.assign(new FileTypeBox(), box);
                    ftyp.parse(atom);
                    this.emit('ftyp', ftyp);
                    return ftyp;
                default:
                    return box;
            }
        });
        // .forEach(box => {
            
        // });
        // Parse FTYP
        // const ftyp = new FileTypeBox();
        // ftyp.parse(atom);
        // this.emit('ftyp', ftyp);
        // Parse MOOV
        // Parse STYP
        // Parse Fragment
            // Parse STYP
            // Parse Chunk
                // Parse STYP
                // Parse PRFT
                // Parse EMSG
                // Parse MOOF
                // Parse MDAT
        this.totalBytes += chunk.length;
        console.log("Writing bytes:", this.totalBytes);
        return callback();
    }
    // Output stream
    _read(size: number) {

    }

    // Initiate readable pull
    parse(buffer: Buffer) {
        if (!Buffer.isBuffer(buffer)) return;
        
    }
}