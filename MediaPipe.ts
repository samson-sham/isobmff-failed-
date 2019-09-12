import { Duplex } from 'stream';
import Box from './Box';

export default class MediaPipe extends Duplex {
    public totalBytes: bigint;
    public documentTree: any[];
    protected _currentBox?: Box;

    constructor() {
        super();
        this.totalBytes = BigInt(0);
        this.documentTree = [];
    }
    protected __boxMultiplexer(box: Box) {
        switch (box.boxType) {
            case "ftyp":
                // const ftyp = Object.assign();

                return 
        } 
    }
    protected __pushData(chunk: Buffer) {
        /**
         *  (new Box()).pipe(chunk).parse().remain(this.__pushData)
         */

        // this._currentBox = this._currentBox || new Box();
        // try {
        //     const [residue, isDone] = this._currentBox.pipe(chunk);

        //     if (isDone) {
        //         this.documentTree.push(this._currentBox);
        //         this._currentBox = void 0;
        //         residue && this.__pushData(residue);
        //     }
        // } catch(e) {
        //     // Save buffer
            
        // }
    }
    // Input stream
    _write(chunk: Buffer, encoding: string, callback: (error?: any) => void) {
        this.totalBytes += BigInt(chunk.length);
        
        
    }
    // Output stream
    _read(size: number) {}
}