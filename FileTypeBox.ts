// Reference: https://www.ftyps.com/
// import {typedArrayToASCII, TypedArray} from './util';
import { InsufficientDataToParseError } from './util';
import Box from './Box';
interface FileTypeInterface {
    majorBrand?: string, 
    minorVersion?: number, 
    compatibleBrands?: string[]
}
export default class FileTypeBox extends Box implements FileTypeInterface {
    public majorBrand?: string
    public minorVersion?: number
    public compatibleBrands?: string[]
    // parse(typedArray: TypedArray): boolean {
    //     // if (!super.parse(typedArray)) return false;
    //     const {buffer, byteOffset, byteLength} = typedArray;
    //     const dataView = new DataView(buffer, byteOffset, byteLength);
    //     this.majorBrand = this.readString(typedArray);
    //     this.minorVersion = dataView.getUint32(this._anchor);
    //     this._anchor += 4;
    //     this.compatibleBrands = [];
    //     for (let i = this._anchor; i < byteLength; i = i+4) {
    //         this.compatibleBrands.push(typedArrayToASCII(typedArray.subarray(i, i+4)));
    //     }
    //     return this.majorBrand === 'ftyp';
    // }
    parse(chunk: Buffer) {
        try {
            if (!this.majorBrand) {
                // this.majorBrand = chunk.toString('utf8', 0, 4);
                // chunk = chunk.subarray(4);
                [this.majorBrand, chunk] = this.readString(chunk);
            }
            if (!this.minorVersion) {
                [this.minorVersion, chunk] = this.readInt(chunk);
                // this.minorVersion = chunk.readUInt32BE(0);
                // chunk = chunk.subarray(4);
            }
            let compatibleBrand;
            this.compatibleBrands = this.compatibleBrands || [];
            while (chunk.length >= 4) {
                [compatibleBrand, chunk] = this.readString(chunk);
                this.compatibleBrands.push(compatibleBrand);
            }
            return chunk;
        } catch(e) {
            if (e instanceof InsufficientDataToParseError) {
                return false;
            }
            throw e;
        }
        // const lastMile = chunk.byteLength - 4;
        // this.compatibleBrands = this.compatibleBrands || [];
        // while (chunk.byteOffset <= lastMile) {
        //     this.compatibleBrands.push(chunk.toString('utf8', 0, 4));
        //     chunk = chunk.subarray(4);
        // }
        
    }
}