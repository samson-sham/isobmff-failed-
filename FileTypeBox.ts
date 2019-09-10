// Reference: https://www.ftyps.com/
import {typedArrayToASCII, TypedArray} from './util';
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
    parse(typedArray: TypedArray): boolean {
        // if (!super.parse(typedArray)) return false;
        const {buffer, byteOffset, byteLength} = typedArray;
        const dataView = new DataView(buffer, byteOffset, byteLength);
        this.majorBrand = this.readString(typedArray);
        this.minorVersion = dataView.getUint32(this._anchor);
        this._anchor += 4;
        this.compatibleBrands = [];
        for (let i = this._anchor; i < byteLength; i = i+4) {
            this.compatibleBrands.push(typedArrayToASCII(typedArray.subarray(i, i+4)));
        }
        return this.majorBrand === 'ftyp';
    }
}